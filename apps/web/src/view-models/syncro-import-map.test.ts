import { describe, expect, it } from 'vitest'
import { mapSyncroRow } from './syncro-import-map'

describe('mapSyncroRow', () => {
  it('maps À appeler + Messagerie to intake ops', () => {
    expect(
      mapSyncroRow({
        id: 'bk-1',
        prenom: 'Marie',
        nom: 'App',
        telephone: '+33600000000',
        email: 'marie@example.com',
        statut: 'À appeler',
        resultat: 'Messagerie',
        valide: 'NON',
      }),
    ).toEqual(
      expect.objectContaining({
        badakanId: 'bk-1',
        firstName: 'Marie',
        lastName: 'App',
        phone: '+33600000000',
        email: 'marie@example.com',
        profileStatus: 'EN_ATTENTE',
        intakeStatus: 'A_APPELER',
        callOutcome: 'MESSAGERIE',
      }),
    )
  })

  it('maps Validé to APP_VALIDATED', () => {
    expect(
      mapSyncroRow({
        id: 'bk-2',
        prenom: 'Paul',
        nom: 'Ok',
        statut: 'Validé',
        valide: 'OUI',
      }),
    ).toEqual(expect.objectContaining({ profileStatus: 'APP_VALIDATED' }))
  })

  it('maps Suspendu to IGNORE', () => {
    expect(
      mapSyncroRow({
        id: 'bk-3',
        prenom: 'Léa',
        nom: 'Stop',
        statut: 'Suspendu',
        valide: 'NON',
      }),
    ).toEqual(expect.objectContaining({ profileStatus: 'IGNORE' }))
  })
})
