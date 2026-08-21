import { describe, expect, it } from 'vitest'
import { parseBoardApplications } from './parse-board-applications'

describe('parseBoardApplications', () => {
  it('maps missing offre_id to null', () => {
    const rows = parseBoardApplications([
      { id: 's1', prenom: 'A', nom: 'B', email: 'a@b.fr' },
    ])
    expect(rows[0]?.offre_id).toBeNull()
  })
})
