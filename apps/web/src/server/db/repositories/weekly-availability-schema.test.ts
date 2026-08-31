import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const schema = readFileSync(resolve(__dirname, '../../../../prisma/schema.prisma'), 'utf8')

describe('Weekly availability schema', () => {
  it('declares dated AM/PM slots, submitted weeks, and a secret token', () => {
    expect(schema).toContain('enum WeeklyAvailabilityPeriod {\n  AM\n  PM\n}')
    expect(schema).toContain('model WeeklyAvailabilityToken')
    expect(schema).toContain('model WeeklyAvailabilityWeek')
    expect(schema).toContain('model WeeklyAvailabilitySlot')
    expect(schema).toMatch(/token\s+String\s+@unique/)
    expect(schema).toContain('@@unique([candidateId, weekStart])')
  })
})
