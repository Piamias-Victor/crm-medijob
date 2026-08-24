import { describe, expect, it } from 'vitest'
import {
  currentExerciceStartYear,
  exerciceFilterOptions,
  exerciceLabel,
  exerciceMonths,
} from '@/view-models/facturation-exercice'

describe('facturation Exercice', () => {
  it('starts in October of the year covering now', () => {
    expect(currentExerciceStartYear(new Date(Date.UTC(2026, 7, 24)))).toBe(2025)
    expect(currentExerciceStartYear(new Date(Date.UTC(2026, 9, 1)))).toBe(2026)
  })

  it('labels Exercice as yy/yy+1', () => {
    expect(exerciceLabel(2025)).toBe('25/26')
  })

  it('offers current, next and Tous', () => {
    expect(exerciceFilterOptions(new Date(Date.UTC(2026, 7, 24))).map((item) => item.label)).toEqual(
      ['25/26', '26/27', 'Tous'],
    )
  })

  it('orders months October to September', () => {
    expect(exerciceMonths(2025)).toEqual([
      '2025-10',
      '2025-11',
      '2025-12',
      '2026-01',
      '2026-02',
      '2026-03',
      '2026-04',
      '2026-05',
      '2026-06',
      '2026-07',
      '2026-08',
      '2026-09',
    ])
  })
})
