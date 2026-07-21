// Manual contract mirror of `git-ranker/docs/openapi/openapi.json` until generated types are introduced.
export const TIER_VALUES = [
  'CHALLENGER',
  'MASTER',
  'DIAMOND',
  'EMERALD',
  'PLATINUM',
  'GOLD',
  'SILVER',
  'BRONZE',
  'IRON',
] as const;

export type Tier = (typeof TIER_VALUES)[number];
export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

export const isTier = (value: string): value is Tier =>
  (TIER_VALUES as readonly string[]).includes(value);

export interface ApiErrorPayload {
  type: string;
  message: string;
  data?: unknown;
}

export interface ApiResponse<T> {
  result: 'SUCCESS' | 'ERROR';
  data: T | null;
  error: ApiErrorPayload | null;
}

export interface AuthMeResponse {
  username: string;
  profileImage: string;
  role: UserRole;
}

export interface User {
  nodeId: string;
  username: string;
  profileImage: string;
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
}

export type RegisterUserResponse = User & UserStats;

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
