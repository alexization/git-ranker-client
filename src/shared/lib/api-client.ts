import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

// 토큰 갱신 중 상태 관리 (중복 갱신 방지)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키 전송을 위해 필수 (refreshToken 쿠키 포함)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 함수
const refreshAccessToken = async (): Promise<string> => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );

  if (response.data?.result === 'SUCCESS' && response.data?.data?.accessToken) {
    return response.data.data.accessToken;
  }

  throw new Error('Failed to refresh token');
};

apiClient.interceptors.response.use(
  (response) => {
    // 백엔드 응답 구조: { result: "SUCCESS", data: {...}, error: null }
    if (response.data?.result === 'SUCCESS' && response.data?.data) {
      return response.data.data;
    }
    // Fallback: 기존 구조도 지원
    return response.data?.success || response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러 + 재시도하지 않은 요청 + refresh 엔드포인트가 아닌 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      // 이미 토큰 갱신 중인 경우, 큐에 추가하고 대기
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // auth-store 업데이트 (localStorage 직접 접근)
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          parsed.state.accessToken = newAccessToken;
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }

        // 기본 헤더 업데이트
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 대기 중인 요청들 처리
        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        processQueue(refreshError as AxiosError, null);

        // auth-store 초기화
        localStorage.removeItem('auth-storage');
        delete apiClient.defaults.headers.common['Authorization'];

        // 로그인 페이지로 리다이렉트 (클라이언트 사이드에서만)
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
