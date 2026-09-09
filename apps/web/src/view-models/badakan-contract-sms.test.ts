import { describe, expect, it } from 'vitest'
import {
  badakanContractReminderSmsContent,
  badakanContractSignSmsContent,
  contractSignSmsReminderCutoff,
} from './badakan-contract-sms'

const NON_GSM7 = /[^A-Za-z0-9 \r\n@£$¥èéùìòÇØøÅåÆæßÉ!"#¤%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\[~\]|€]/

describe('badakanContractSignSmsContent', () => {
  it('invites the Candidate to sign the Badakan contract sent by email', () => {
    expect(badakanContractSignSmsContent).toBe(
      'Bonne nouvelle ! Vous etes validé(e) pour la mission. Contrat envoyé par e-mail via Badakan. Consultez-le et signez.',
    )
  })

  it('fits a single GSM-7 segment', () => {
    expect(badakanContractSignSmsContent).not.toMatch(NON_GSM7)
    expect(badakanContractSignSmsContent.length).toBeLessThanOrEqual(160)
  })
})

describe('badakanContractReminderSmsContent', () => {
  it('reminds the Candidate the contract is still unsigned', () => {
    expect(badakanContractReminderSmsContent).toBe(
      "MediJob : votre contrat n'est pas encore signe. Consultez l'e-mail Badakan et signez.",
    )
  })

  it('fits a single GSM-7 segment', () => {
    expect(badakanContractReminderSmsContent).not.toMatch(NON_GSM7)
    expect(badakanContractReminderSmsContent.length).toBeLessThanOrEqual(160)
  })
})

describe('contractSignSmsReminderCutoff', () => {
  it('is 24 hours before now', () => {
    expect(contractSignSmsReminderCutoff(new Date('2026-09-10T12:00:00.000Z'))).toEqual(
      new Date('2026-09-09T12:00:00.000Z'),
    )
  })
})
