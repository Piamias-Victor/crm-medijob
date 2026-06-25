import { describe, expect, it } from 'vitest'
import {
  buildCandidateExportCsv,
  toCandidateExportRow,
} from '@/view-models/candidate-export-vm'
import type { RawCandidateExport } from '@/view-models/candidate-export.types'

const raw: RawCandidateExport = {
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  phone: '0612345678',
  address: '1 rue Example',
  city: 'Lyon',
  postalCode: '69003',
  mobilityRadiusKm: 30,
  mobilityNotes: 'Sud Lyon',
  availableFrom: null,
  notes: 'Top profil',
  cvSummary: 'Résumé',
  anonymizedProfile: null,
  createdAt: new Date('2024-06-01T10:00:00Z'),
  updatedAt: new Date('2024-06-02T10:00:00Z'),
  jobTitle: { name: 'Pharmacien' },
  referent: { name: 'Recruteur' },
  softwares: [{ software: { name: 'LGO Alpha' } }, { software: { name: 'LGO Beta' } }],
  contractPreferences: [{ contractType: 'CDI' }, { contractType: 'CDD' }],
  missions: [
    {
      mission: { title: 'Mission Lyon', status: 'EN_RECHERCHE' },
      stage: { name: 'Entretien' },
    },
  ],
}

describe('toCandidateExportRow', () => {
  it('maps identity, location and CRM fields for CSV export', () => {
    const row = toCandidateExportRow(raw)

    expect(row).toMatchObject({
      lastName: 'Durand',
      firstName: 'Camille',
      email: 'camille@example.com',
      phone: '0612345678',
      city: 'Lyon',
      postalCode: '69003',
      department: '69',
      jobTitle: 'Pharmacien',
      referent: 'Recruteur',
      availability: 'Dès que possible',
    })
  })

  it('joins multi-value fields with semicolons', () => {
    const row = toCandidateExportRow(raw)

    expect(row.softwares).toBe('LGO Alpha; LGO Beta')
    expect(row.contractTypes).toBe('CDI; CDD')
    expect(row.activeMission).toBe('Oui — Mission Lyon')
  })

  it('defaults missing identity fields when select is partial', () => {
    const row = toCandidateExportRow({ email: 'camille@example.com' })

    expect(row).toMatchObject({
      firstName: '',
      lastName: '',
      email: 'camille@example.com',
    })
  })
})

describe('buildCandidateExportCsv', () => {
  it('exports selected columns with UTF-8 BOM', () => {
    const csv = buildCandidateExportCsv(
      [toCandidateExportRow(raw)],
      ['lastName', 'firstName', 'softwares'],
    )

    expect(csv.charCodeAt(0)).toBe(0xfeff)
    expect(csv).toContain('Nom;Prénom;LGO')
    expect(csv).toContain('Durand;Camille;"LGO Alpha; LGO Beta"')
  })

  it('sorts rows even when the sort column is not exported', () => {
    const rows = [
      toCandidateExportRow({ ...raw, lastName: 'Zorro', firstName: 'A' }),
      toCandidateExportRow({ ...raw, lastName: 'Alpha', firstName: 'B' }),
    ]
    const csv = buildCandidateExportCsv(rows, ['firstName'], {
      columnId: 'lastName',
      direction: 'asc',
    })

    expect(csv.slice(1)).toBe('Prénom\nB\nA')
  })
})
