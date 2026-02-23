import { z } from "zod"
import { translate } from "@/shared/i18n/translate"

// GitHub username validation
// Rules: alphanumeric, hyphens, 1-39 chars, no consecutive hyphens, no start/end with hyphen
const createGithubUsernameSchema = () =>
  z
    .string()
    .min(1, translate("validation.username.required"))
    .max(39, translate("validation.username.max"))
    .regex(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
      translate("validation.username.pattern")
    )
    .refine(
      (val) => !val.includes("--"),
      translate("validation.username.no-consecutive-hyphen")
    )

export const githubUsernameSchema = createGithubUsernameSchema()

// Search query validation
const createSearchQuerySchema = () =>
  z
    .string()
    .min(1, translate("validation.search.required"))
    .max(100, translate("validation.search.max"))
    .transform((val) => val.trim())

export const searchQuerySchema = createSearchQuerySchema()

// Page number validation
const createPageNumberSchema = () =>
  z
    .number()
    .int(translate("validation.page.int"))
    .min(0, translate("validation.page.min"))
    .max(10000, translate("validation.page.max"))

export const pageNumberSchema = createPageNumberSchema()

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
  const result = createGithubUsernameSchema().safeParse(username)
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
  const result = createSearchQuerySchema().safeParse(query)
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
  const result = createPageNumberSchema().safeParse(page)
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
