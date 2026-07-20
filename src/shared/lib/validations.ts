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
