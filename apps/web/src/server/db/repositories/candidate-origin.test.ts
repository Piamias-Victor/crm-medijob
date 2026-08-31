import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const schema = readFileSync(resolve(__dirname, '../../../../prisma/schema.prisma'), 'utf8')

describe('Candidate origin schema', () => {
  it('declares origin App and unique nullable badakanId', () => {
    expect(schema).toContain('enum CandidateOrigin {\n  CRM\n  APP\n}')
    expect(schema).toMatch(/origin\s+CandidateOrigin @default\(CRM\)/)
    expect(schema).toMatch(/badakanId\s+String\?\s+@unique/)
  })
})
