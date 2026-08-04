import { describe, it, expect } from 'vitest'
import { shouldApplyUrlFilters } from '@/lib/filters/filter-url-sync'

describe('shouldApplyUrlFilters', () => {
  it('skips applying URL when it matches the last write (avoids lyon↔ly ping-pong)', () => {
    expect(
      shouldApplyUrlFilters({
        pendingWrittenQuery: 'ville=lyon',
        currentQuery: 'ville=lyon',
      }),
    ).toBe(false)
  })

  it('applies URL when browser navigates to a different query', () => {
    expect(
      shouldApplyUrlFilters({
        pendingWrittenQuery: 'ville=ly',
        currentQuery: 'ville=lyon',
      }),
    ).toBe(true)
  })

  it('applies URL when nothing pending', () => {
    expect(
      shouldApplyUrlFilters({
        pendingWrittenQuery: null,
        currentQuery: 'ville=lyon',
      }),
    ).toBe(true)
  })
})
