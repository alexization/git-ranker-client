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
  (response) => {
    // 백엔드 응답 구조: { result: "SUCCESS", data: {...}, error: null }
    if (response.data?.result === 'SUCCESS' && response.data?.data) {
      return response.data.data;
    }
    // Fallback: 기존 구조도 지원
    return response.data?.success || response.data;
  },
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
