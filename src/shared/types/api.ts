export type Tier = 
  | 'CHALLENGER' | 'MASTER' | 'DIAMOND' | 'EMERALD' 
  | 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'IRON';

// 백엔드 실제 응답 구조
export interface ApiResponse<T> {
  result: 'SUCCESS' | 'ERROR';
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
}

// 레거시 타입 (호환성 유지)
export interface ApiResponseLegacy<T> {
  resultType: 'SUCCESS' | 'ERROR';
  error?: {
    code: string;
    message: string;
    data?: unknown;
  };
  success?: T;
}

export interface User {
  userId: number;
  githubId: number;
  nodeId: string;
  username: string;
  email: string | null;
  profileImage: string;
  role: 'USER' | 'ADMIN';
  updatedAt: string;
  lastFullScanAt: string;
  totalScore: number;
  ranking: number;
  tier: Tier;
  percentile: number;
}

export interface UserStats {
  commitCount: number;
  issueCount: number;
  prCount: number;
  mergedPrCount: number;
  reviewCount: number;
  diffCommitCount: number;
  diffIssueCount: number;
  diffPrCount: number;
  diffMergedPrCount: number;
  diffReviewCount: number;
  // [Fix] 백엔드 응답 포맷 대응 (PascalCase fallback)
  PrCount?: number;
}

export interface RegisterUserResponse extends User, UserStats {
  isNewUser: boolean;
}

export interface RankingUserInfo {
  username: string;
  profileImage: string;
  ranking: number;
  totalScore: number;
  tier: Tier;
}

export interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface RankingListResponse {
  rankings: RankingUserInfo[];
  pageInfo: PageInfo;
}

