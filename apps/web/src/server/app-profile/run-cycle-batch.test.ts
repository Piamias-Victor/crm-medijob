import { describe, expect, it, vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { runAppProfileCycle } from './run-cycle'
import { stubCycleDeps } from './run-cycle.test-deps'

const env = { NODE_ENV: 'test', BADAKAN_EMAIL: 'a@b.c', BADAKAN_PASSWORD: 'x' } as const

const leo = mapBadakanRecipient({
  id: 'bk-leo',
  firstName: 'Leo',
  lastName: 'Old',
})!
const marie = mapBadakanRecipient({
  id: 'bk-marie',
  firstName: 'Marie',
  lastName: 'New',
})!

describe('runAppProfileCycle convert order', () => {
  it('feeds oldest Profils app inbox rows into CVthèque sync first', async () => {
    const syncValidated = vi.fn().mockResolvedValue({ created: 2, linked: 0, skipped: 0 })
    await runAppProfileCycle(
      env,
      stubCycleDeps({
        client: { searchNewEmployees: async () => [marie, leo] },
        listConvertQueue: async () => [
          { badakanId: 'bk-marie', createdAt: new Date('2026-09-07T00:00:00.000Z') },
          { badakanId: 'bk-leo', createdAt: new Date('2026-09-05T00:00:00.000Z') },
        ],
        syncValidated,
      }),
    )
    const fed = syncValidated.mock.calls[0]?.[0] as Array<{ badakanId: string }>
    expect(fed.map((row) => row.badakanId)).toEqual(['bk-leo', 'bk-marie'])
  })
})
