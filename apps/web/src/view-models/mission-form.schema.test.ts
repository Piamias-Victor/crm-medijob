import { describe, it, expect } from 'vitest'
import { missionInputSchema } from '@/view-models/mission-form.schema'

const base = {
  title: 'Mission test',
  jobTitleId: 'jt1',
  contractType: 'CDI' as const,
  pharmacyId: 'p1',
  referentId: 'r1',
  tempsPlein: true,
}

describe('missionInputSchema', () => {
  it('rejects submit when start date was cleared', () => {
    const result = missionInputSchema.safeParse({ ...base, startDate: undefined })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'startDate')).toBe(true)
    }
  })

  it('accepts submit when start date is set', () => {
    const result = missionInputSchema.safeParse({
      ...base,
      startDate: new Date('2026-06-19T12:00:00'),
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.startDate).toBeInstanceOf(Date)
    }
  })
})
