import { describe, expect, it } from 'vitest'
import { buildInboxAcceptDefaults } from './inbox-accept-defaults'

describe('buildInboxAcceptDefaults', () => {
  it('prefills identity and falls back to the first job title', () => {
    const values = buildInboxAcceptDefaults({
      firstName: 'Léa',
      lastName: 'Martin',
      email: 'lea@site.fr',
      phone: '0600000001',
      city: 'Lyon',
      jobTitleId: null,
      referentId: 'u1',
      fallbackJobTitleId: 'jt1',
    })
    expect(values).toMatchObject({
      firstName: 'Léa',
      lastName: 'Martin',
      email: 'lea@site.fr',
      jobTitleId: 'jt1',
      status: 'NOUVEAU',
      consentGiven: true,
    })
  })

  it('prefills Notes internes when provided', () => {
    const values = buildInboxAcceptDefaults({
      firstName: 'Léa',
      lastName: 'Martin',
      jobTitleId: 'jt1',
      referentId: 'u1',
      fallbackJobTitleId: 'jt1',
      notes: 'Répondeur : Entretien téléphonique.',
    })
    expect(values.notes).toBe('Répondeur : Entretien téléphonique.')
  })
})
