import { describe, it, expect } from 'vitest'
import {
  getTierDotColor,
  getTierBadgeStyle,
  getTierTextColor,
  TIER_DOT_COLORS,
  TIER_BADGE_STYLES,
  TIER_TEXT_COLORS,
} from '@/shared/constants/tier-styles'

describe('tier style helpers', () => {
  it('returns the dot color for a known tier', () => {
    expect(getTierDotColor('MASTER')).toBe(TIER_DOT_COLORS.MASTER)
  })

  it('returns the text color for a known tier', () => {
    expect(getTierTextColor('CHALLENGER')).toBe(TIER_TEXT_COLORS.CHALLENGER)
  })

  it('falls back to IRON for an empty tier string', () => {
    expect(getTierBadgeStyle('')).toBe(TIER_BADGE_STYLES.IRON)
  })

  it('falls back to IRON for a lowercase (non-canonical) tier', () => {
    expect(getTierDotColor('master')).toBe(TIER_DOT_COLORS.IRON)
  })
})
