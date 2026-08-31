import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { probeInactiveRecipients } from './sync-validated-probe'

const marieSuspended = mapBadakanRecipient({
  id: 'bk-marie',
  firstName: 'Marie',
  lastName: 'App',
  status: 'SUSPENDED',
})!

describe('probeInactiveRecipients', () => {
  it('GETs linked recipients missing from searchEmployees when SUSPENDED', async () => {
    const rows = await probeInactiveRecipients([], {
      listLinked: async () => ['bk-marie'],
      getRecipient: async () => marieSuspended,
    })
    expect(rows).toEqual([marieSuspended])
  })

  it('skips linked recipients still present in searchEmployees', async () => {
    const getRecipient = async () => marieSuspended
    const calls = { n: 0 }
    const rows = await probeInactiveRecipients([marieSuspended], {
      listLinked: async () => ['bk-marie'],
      getRecipient: async () => {
        calls.n += 1
        return getRecipient()
      },
    })
    expect(rows).toEqual([])
    expect(calls.n).toBe(0)
  })
})
