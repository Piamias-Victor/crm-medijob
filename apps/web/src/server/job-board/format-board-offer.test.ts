import { describe, expect, it } from 'vitest'
import {
  BOARD_ENTREPRISE,
  formatBoardOfferCity,
  formatBoardOfferTitle,
} from '@/server/job-board/format-board-offer'

describe('formatBoardOfferTitle', () => {
  it('returns trimmed poste label only', () => {
    expect(formatBoardOfferTitle('  Pharmacien  ')).toBe('Pharmacien')
  })

  it('does not append city or pharmacy', () => {
    expect(formatBoardOfferTitle('Conseiller en parapharmacie')).toBe(
      'Conseiller en parapharmacie',
    )
  })
})

describe('formatBoardOfferCity', () => {
  it('trims city or falls back', () => {
    expect(formatBoardOfferCity('  Lyon  ')).toBe('Lyon')
    expect(formatBoardOfferCity(null)).toBe('Non précisée')
    expect(formatBoardOfferCity('')).toBe('Non précisée')
  })
})

describe('BOARD_ENTREPRISE', () => {
  it('is MEDIJOB', () => {
    expect(BOARD_ENTREPRISE).toBe('MEDIJOB')
  })
})
