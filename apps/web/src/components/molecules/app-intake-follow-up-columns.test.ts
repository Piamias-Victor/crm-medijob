import { describe, expect, it } from 'vitest'
import { buildAppIntakeFollowUpColumns } from './app-intake-follow-up-columns'

describe('buildAppIntakeFollowUpColumns', () => {
  it('lists identity, Intake ops, Referent, relance, last-call', () => {
    expect(buildAppIntakeFollowUpColumns().map((col) => [col.id, col.header])).toEqual([
      ['phone', 'Téléphone'],
      ['firstName', 'Prénom'],
      ['lastName', 'Nom'],
      ['email', 'Email'],
      ['metier', 'Métier'],
      ['city', 'Ville'],
      ['postalCode', 'CP'],
      ['enrolledAt', 'Inscrit le'],
      ['badakanComments', 'Commentaires Badakan'],
      ['intakeBookingSms', 'SMS RDV'],
      ['intakeStatus', 'Intake'],
      ['callOutcome', 'Appel'],
      ['plannedRdvAt', 'RDV'],
      ['referent', 'Referent'],
      ['relanceAt', 'Relance'],
      ['lastCalledAt', 'Dernier appel'],
      ['notes', 'Notes'],
      ['actions', ''],
    ])
  })

  it('wires cell editors for ops columns including Referent and relance', () => {
    const cols = Object.fromEntries(
      buildAppIntakeFollowUpColumns().map((col) => [col.id, Boolean(col.cell)]),
    )
    expect(cols).toMatchObject({
      intakeStatus: true,
      callOutcome: true,
      plannedRdvAt: true,
      referent: true,
      relanceAt: true,
      notes: true,
      actions: true,
      lastCalledAt: false,
      phone: false,
    })
  })
})
