import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const schema = readFileSync(resolve(__dirname, '../../../../prisma/schema.prisma'), 'utf8')

describe('T4S import schema fields', () => {
  it('declares unique nullable t4sId on Candidate Pharmacy Contact', () => {
    expect(schema).toMatch(/model Candidate \{[\s\S]*?t4sId\s+String\?\s+@unique/)
    expect(schema).toMatch(/model Pharmacy \{[\s\S]*?t4sId\s+String\?\s+@unique/)
    expect(schema).toMatch(/model Contact \{[\s\S]*?t4sId\s+String\?\s+@unique/)
  })

  it('declares Candidate photoUrl like cvUrl', () => {
    expect(schema).toMatch(/cvUrl\s+String\?/)
    expect(schema).toMatch(/photoUrl\s+String\?/)
  })
})
