import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { orderConvertBatch } from './convert-batch'

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

describe('orderConvertBatch', () => {
  it('puts older EN_ATTENTE AppProfiles before newer ones', () => {
    const ordered = orderConvertBatch([marie, leo], [
      { badakanId: 'bk-marie', createdAt: new Date('2026-09-07T00:00:00.000Z') },
      { badakanId: 'bk-leo', createdAt: new Date('2026-09-05T00:00:00.000Z') },
    ])
    expect(ordered.map((row) => row.badakanId)).toEqual(['bk-leo', 'bk-marie'])
  })

  it('keeps recipients without an inbox row after the pending queue', () => {
    const extra = mapBadakanRecipient({
      id: 'bk-done',
      firstName: 'Done',
      lastName: 'App',
    })!
    const ordered = orderConvertBatch([extra, marie, leo], [
      { badakanId: 'bk-leo', createdAt: new Date('2026-09-05T00:00:00.000Z') },
    ])
    expect(ordered.map((row) => row.badakanId)).toEqual(['bk-leo', 'bk-done', 'bk-marie'])
  })
})
