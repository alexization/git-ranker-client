import { z } from "zod"

// GitHub username validation
// Rules: alphanumeric, hyphens, 1-39 chars, no consecutive hyphens, no start/end with hyphen
export const githubUsernameSchema = z
  .string()
  .min(1, "사용자 이름을 입력해주세요.")
  .max(39, "GitHub 사용자 이름은 39자를 초과할 수 없습니다.")
  .regex(
    /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
    "유효한 GitHub 사용자 이름을 입력해주세요."
  )
  .refine(
    (val) => !val.includes("--"),
    "사용자 이름에 연속된 하이픈(--)을 사용할 수 없습니다."
  )

// Search query validation
export const searchQuerySchema = z
  .string()
  .min(1, "검색어를 입력해주세요.")
  .max(100, "검색어가 너무 깁니다.")
  .transform((val) => val.trim())

// Page number validation
export const pageNumberSchema = z
  .number()
  .int("페이지 번호는 정수여야 합니다.")
  .min(0, "페이지 번호는 0 이상이어야 합니다.")
  .max(10000, "페이지 번호가 너무 큽니다.")

// Tier validation
export const tierSchema = z.enum([
  "CHALLENGER",
  "MASTER",
  "DIAMOND",
  "PLATINUM",
  "GOLD",
  "SILVER",
  "BRONZE",
  "IRON",
])

// API Response validation schemas
export const userResponseSchema = z.object({
  username: z.string(),
  tier: tierSchema,
  totalScore: z.number(),
  ranking: z.number(),
  percentile: z.number(),
  profileImage: z.string().url(),
  nodeId: z.string(),
  lastFullScanAt: z.string().datetime(),
})

export const rankingItemSchema = z.object({
  username: z.string(),
  tier: tierSchema,
  totalScore: z.number(),
  ranking: z.number(),
  profileImage: z.string().url(),
})

export const pageInfoSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  currentPage: z.number().optional(),
  pageSize: z.number().optional(),
})

export const rankingResponseSchema = z.object({
  rankings: z.array(rankingItemSchema),
  pageInfo: pageInfoSchema.optional(),
})

// Validation helper functions
export function validateGithubUsername(username: string): {
  success: boolean
  data?: string
  error?: string
} {
  const result = githubUsernameSchema.safeParse(username)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error.issues[0]?.message }
}

export function validateSearchQuery(query: string): {
  success: boolean
  data?: string
  error?: string
} {
  const result = searchQuerySchema.safeParse(query)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error.issues[0]?.message }
}

export function validatePageNumber(page: number): {
  success: boolean
  data?: number
  error?: string
} {
  const result = pageNumberSchema.safeParse(page)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error.issues[0]?.message }
}

// Type exports
export type Tier = z.infer<typeof tierSchema>
export type User = z.infer<typeof userResponseSchema>
export type RankingItem = z.infer<typeof rankingItemSchema>
export type PageInfo = z.infer<typeof pageInfoSchema>
export type RankingResponse = z.infer<typeof rankingResponseSchema>
