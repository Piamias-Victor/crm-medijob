import { describe, expect, it } from 'vitest'
import { parseBoardApplications } from './parse-board-applications'

describe('parseBoardApplications', () => {
  it('maps missing offre_id to null', () => {
    const rows = parseBoardApplications([
      { id: 's1', prenom: 'A', nom: 'B', email: 'a@b.fr' },
    ])
    expect(rows[0]?.offre_id).toBeNull()
  })

  it('skips rows with empty email and keeps valid submissions', () => {
    const rows = parseBoardApplications([
      { id: 'bad', prenom: 'X', nom: 'Y', email: '' },
      { id: 'ok', prenom: 'A', nom: 'B', email: 'a@b.fr' },
    ])
    expect(rows).toEqual([
      expect.objectContaining({ id: 'ok', email: 'a@b.fr' }),
    ])
  })

  it('returns empty list when every submission is invalid', () => {
    expect(
      parseBoardApplications([{ id: 'bad', prenom: 'X', nom: 'Y', email: '' }]),
    ).toEqual([])
  })
})
