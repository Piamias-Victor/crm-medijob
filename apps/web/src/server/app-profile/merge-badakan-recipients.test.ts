import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { mergeBadakanRecipients } from './merge-badakan-recipients'

describe('mergeBadakanRecipients', () => {
  it('lets searchEmployees win when the same person is also in Profils app', () => {
    const inbox = mapBadakanRecipient({
      id: 'e1',
      firstName: 'Leo',
      isValid: false,
    })!
    const employee = mapBadakanRecipient({
      id: 'e1',
      firstName: 'Leo',
      isValid: true,
    })!
    expect(mergeBadakanRecipients([inbox], [employee])).toEqual([employee])
  })
})
