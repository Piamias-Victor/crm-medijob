import { describe, expect, it } from 'vitest'
import { buildAppIntakeFollowUpColumns } from './app-intake-follow-up-columns'

describe('buildAppIntakeFollowUpColumns', () => {
  it('lists read-only identity columns for App intake follow-up', () => {
    expect(buildAppIntakeFollowUpColumns().map((col) => [col.id, col.header])).toEqual([
      ['phone', 'Téléphone'],
      ['firstName', 'Prénom'],
      ['lastName', 'Nom'],
      ['email', 'Email'],
      ['metier', 'Métier'],
      ['city', 'Ville'],
      ['postalCode', 'CP'],
      ['enrolledAt', 'Inscrit le'],
    ])
  })
})
