import { describe, expect, it } from 'vitest'
import { buildAppIntakeFollowUpColumns } from './app-intake-follow-up-columns'

describe('buildAppIntakeFollowUpColumns', () => {
  it('lists identity plus editable Intake ops columns', () => {
    expect(buildAppIntakeFollowUpColumns().map((col) => [col.id, col.header])).toEqual([
      ['phone', 'Téléphone'],
      ['firstName', 'Prénom'],
      ['lastName', 'Nom'],
      ['email', 'Email'],
      ['metier', 'Métier'],
      ['city', 'Ville'],
      ['postalCode', 'CP'],
      ['enrolledAt', 'Inscrit le'],
      ['intakeStatus', 'Intake'],
      ['callOutcome', 'Appel'],
      ['plannedRdvAt', 'RDV'],
      ['notes', 'Notes'],
    ])
  })

  it('wires cell editors for Intake ops columns', () => {
    const cols = Object.fromEntries(
      buildAppIntakeFollowUpColumns().map((col) => [col.id, Boolean(col.cell)]),
    )
    expect(cols).toMatchObject({
      intakeStatus: true,
      callOutcome: true,
      plannedRdvAt: true,
      notes: true,
      phone: false,
    })
  })
})
