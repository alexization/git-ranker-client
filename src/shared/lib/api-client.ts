import axios from 'axios';

// 환경 변수에서 API URL을 가져오거나 기본값 사용
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키 전송을 위해 필수
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data.success || response.data, // ApiResponse 래퍼 제거 편의성
  async (error) => {
    // TODO: 401 에러 발생 시 리프레시 토큰 로직 구현
    // const originalRequest = error.config;
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   // Call refresh token API
    //   // Retry original request
    // }
    return Promise.reject(error);
  }
);
