import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(__dirname, '../../../../prisma')
const schema = readFileSync(resolve(root, 'schema.prisma'), 'utf8')
const migration = readFileSync(
  resolve(root, 'migrations/20260910110000_pharmacy_apply_email/migration.sql'),
  'utf8',
)

describe('BadakanPharmacyApplyEmail journal', () => {
  it('keys one row per Badakan mission and SEARCH_APPLIED recipient', () => {
    expect(schema).toMatch(/model BadakanPharmacyApplyEmail/)
    expect(schema).toMatch(/missionBadakanId\s+String/)
    expect(schema).toMatch(/recipientId\s+String/)
    expect(schema).toMatch(/@@unique\(\[missionBadakanId, recipientId\]\)/)
  })

  it('seeds existing SEARCH_APPLIED so go-live does not burst', () => {
    expect(migration).toContain('BadakanPharmacyApplyEmail')
    expect(migration).toContain('BadakanSearchApplied')
    expect(migration).toMatch(/ON CONFLICT/)
  })
})
