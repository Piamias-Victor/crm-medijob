import { describe, expect, it } from 'vitest'
import {
  candidateCsvColumnMapSchema,
  mapCandidateCsvRows,
} from '@/view-models/candidate-csv-import.schema'

const jobTitles = [
  { id: 'jt1', name: 'Pharmacien' },
  { id: 'jt2', name: 'Préparateur' },
]

describe('mapCandidateCsvRows', () => {
  const headers = ['Prénom', 'Nom', 'Email', 'Métier', 'Statut']
  const map = candidateCsvColumnMapSchema.parse({
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    jobTitle: 'Métier',
    status: 'Statut',
  })

  it('maps valid rows and resolves job title label', () => {
    const result = mapCandidateCsvRows(
      headers,
      [['Camille', 'Durand', 'camille@x.fr', 'Pharmacien', 'Nouveau']],
      map,
      jobTitles,
    )
    expect(result.errors).toEqual([])
    expect(result.rows).toEqual([
      expect.objectContaining({
        firstName: 'Camille',
        lastName: 'Durand',
        email: 'camille@x.fr',
        jobTitleId: 'jt1',
        status: 'NOUVEAU',
      }),
    ])
  })

  it('blocks unknown job title in preview', () => {
    const result = mapCandidateCsvRows(
      headers,
      [['Camille', 'Durand', 'camille@x.fr', 'Inconnu', 'Nouveau']],
      map,
      jobTitles,
    )
    expect(result.rows).toEqual([])
    expect(result.errors).toEqual([
      expect.objectContaining({ row: 2, message: expect.stringContaining('Métier') }),
    ])
  })

  it('defaults missing status to NOUVEAU', () => {
    const noStatus = candidateCsvColumnMapSchema.parse({
      firstName: 'Prénom',
      lastName: 'Nom',
      jobTitle: 'Métier',
    })
    const result = mapCandidateCsvRows(
      ['Prénom', 'Nom', 'Métier'],
      [['Bob', 'Martin', 'Préparateur']],
      noStatus,
      jobTitles,
    )
    expect(result.rows[0]?.status).toBe('NOUVEAU')
    expect(result.rows[0]?.jobTitleId).toBe('jt2')
  })
})
