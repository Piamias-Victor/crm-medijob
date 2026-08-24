import { describe, expect, it } from 'vitest'
import {
  currentExerciceStartYear,
  exerciceFilterOptions,
  exerciceLabel,
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
})
