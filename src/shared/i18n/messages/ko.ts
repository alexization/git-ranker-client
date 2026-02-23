import type { MessageKey } from "@/shared/i18n/messages/en";

export const koMessages: Record<MessageKey, string> = {
  "common.retry": "다시 시도",
  "common.cancel": "취소",
  "common.confirm": "확인",
  "common.loading": "로딩 중...",
  "common.error": "문제가 발생했습니다.",
  "common.login": "로그인",
  "common.logout": "로그아웃",
  "common.profile": "내 프로필",
  "common.settings": "설정",
  "home.search.placeholder": "GitHub 유저 검색...",
  "home.search.submit": "검색",
  "error.401": "로그인이 필요합니다.",
  "error.403": "접근 권한이 없습니다.",
  "error.404": "요청한 리소스를 찾을 수 없습니다.",
  "error.429": "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  "error.500": "서버 오류가 발생했습니다.",
};
