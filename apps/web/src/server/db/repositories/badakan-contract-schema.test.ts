import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(__dirname, '../../../../prisma')
const schema = readFileSync(resolve(root, 'schema.prisma'), 'utf8')
const migration = readFileSync(
  resolve(root, 'migrations/20260909133000_badakan_contract_sign_invite_sms/migration.sql'),
  'utf8',
)

describe('BadakanContract sign-invite SMS', () => {
  it('stores recipient id and SMS clocks on the Badakan contract', () => {
    expect(schema).toMatch(/recipientId\s+String\?/)
    expect(schema).toMatch(/signInviteSmsSentAt\s+DateTime\?/)
    expect(schema).toMatch(/signInviteReminderSentAt\s+DateTime\?/)
  })

  it('stamps existing CREATED contracts so go-live does not burst', () => {
    expect(migration).toContain('signInviteSmsSentAt')
    expect(migration).toContain('signInviteReminderSentAt')
    expect(migration).toMatch(/WHERE "status" = 'CREATED'/)
  })
})
