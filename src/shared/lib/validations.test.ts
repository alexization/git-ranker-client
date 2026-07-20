import { describe, it, expect } from 'vitest'
import { validateGithubUsername } from '@/shared/lib/validations'
import { translate } from '@/shared/i18n/translate'

// node 환경에서 translate는 DEFAULT_LOCALE('en') 메시지를 반환한다.
describe('validateGithubUsername', () => {
  it('accepts a valid username', () => {
    const result = validateGithubUsername('octocat')
    expect(result.success).toBe(true)
    expect(result.data).toBe('octocat')
  })

  it('accepts a single-character username (min boundary)', () => {
    expect(validateGithubUsername('a').success).toBe(true)
  })

  it('accepts a 39-character username (max boundary)', () => {
    expect(validateGithubUsername('a'.repeat(39)).success).toBe(true)
  })

  it('rejects an empty string with the required message', () => {
    const result = validateGithubUsername('')
    expect(result.success).toBe(false)
    expect(result.error).toBe(translate('validation.username.required'))
  })

  it('rejects a username longer than 39 characters', () => {
    const result = validateGithubUsername('a'.repeat(40))
    expect(result.success).toBe(false)
    expect(result.error).toBe(translate('validation.username.max'))
  })

  it('rejects a leading hyphen with the pattern message', () => {
    const result = validateGithubUsername('-octocat')
    expect(result.success).toBe(false)
    expect(result.error).toBe(translate('validation.username.pattern'))
  })

  it('rejects a trailing hyphen with the pattern message', () => {
    const result = validateGithubUsername('octocat-')
    expect(result.success).toBe(false)
    expect(result.error).toBe(translate('validation.username.pattern'))
  })

  it('rejects consecutive hyphens with the dedicated message', () => {
    const result = validateGithubUsername('oct--cat')
    expect(result.success).toBe(false)
    expect(result.error).toBe(translate('validation.username.no-consecutive-hyphen'))
  })
})
