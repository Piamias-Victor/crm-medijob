import { describe, it, expect } from 'vitest'
import { candidateBlacklistHeaderChips } from '@/view-models/candidate-blacklist-header-chips'

describe('candidateBlacklistHeaderChips', () => {
  it('shows Blacklisté chip only for BLACKLISTE', () => {
    expect(candidateBlacklistHeaderChips('QUALIFIE')).toBeUndefined()
    expect(candidateBlacklistHeaderChips('BLACKLISTE')?.[0]?.label).toBe('Blacklisté')
  })
})
