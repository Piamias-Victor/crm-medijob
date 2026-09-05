import { describe, expect, it } from 'vitest'
import { parseCommentIntake } from './comment-intake.schema'

describe('parseCommentIntake', () => {
  it('reads software names and availability from AI JSON', () => {
    const parsed = parseCommentIntake(
      JSON.stringify({
        softwares: ['LGPI', 'Winpharma'],
        availableFrom: '2026-09-15T00:00:00.000Z',
        mobilityRadiusKm: 30,
      }),
    )
    expect(parsed.softwares).toEqual(['LGPI', 'Winpharma'])
    expect(parsed.availableFrom).toBe('2026-09-15T00:00:00.000Z')
    expect(parsed.mobilityRadiusKm).toBe(30)
  })

  it('keeps the other fields when the model fills a blank with null', () => {
    const parsed = parseCommentIntake(
      JSON.stringify({
        jobTitle: 'Préparatrice',
        softwares: ['LEO', 'LGPI'],
        mobilityRadiusKm: null,
        mobilityNotes: null,
      }),
    )
    expect(parsed).toEqual({ jobTitle: 'Préparatrice', softwares: ['LEO', 'LGPI'] })
  })

  it('drops a single out-of-range field instead of the whole extraction', () => {
    const parsed = parseCommentIntake(
      JSON.stringify({ jobTitle: 'Pharmacien', mobilityRadiusKm: 9000 }),
    )
    expect(parsed).toEqual({ jobTitle: 'Pharmacien' })
  })

  it('unwraps a fenced markdown answer', () => {
    const parsed = parseCommentIntake('```json\n{"jobTitle":"Rayonniste"}\n```')
    expect(parsed.jobTitle).toBe('Rayonniste')
  })

  it('still rejects a non-JSON answer', () => {
    expect(() => parseCommentIntake('je ne peux pas répondre')).toThrow('AI_RESPONSE_NOT_JSON')
  })
})
