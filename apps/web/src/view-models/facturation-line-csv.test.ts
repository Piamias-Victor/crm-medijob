import { describe, expect, it } from 'vitest'
import { buildCsv } from '@/lib/csv/build-csv'
import { buildFacturationLinesCsv } from '@/view-models/facturation-line-csv'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

const row: FacturationSuiviRow = {
  missionId: null,
  financeLineId: 'l1',
  pharmacyId: 'p1',
  pharmacyName: 'Pharma Nord',
  candidateName: 'Ada Lovelace',
  jobTitle: 'Pharmacien',
  referentId: 'u1',
  referentName: 'Alice',
  contractType: 'CDD',
  commercialStatus: 'ACCEPTE',
  sentAt: null,
  acceptedAt: new Date('2026-08-01T00:00:00Z'),
  amountHt: 5000,
  marge: 1500,
  cancelled: false,
  invoiced: true,
  paid: false,
}

describe('buildFacturationLinesCsv', () => {
  it('exports filtered list with JobTitle and amounts', () => {
    const csv = buildFacturationLinesCsv([row])
    expect(csv).toBe(
      buildCsv(
        [
          'Pharmacie',
          'Candidat',
          'Métier',
          'Contrat',
          'Référent',
          'Date',
          'CA HT',
          'Marge',
          'Statut',
          'Facturé',
          'Encaissé',
        ],
        [
          [
            'Pharma Nord',
            'Ada Lovelace',
            'Pharmacien',
            'CDD',
            'Alice',
            '01/08/2026',
            '5 000,00 €',
            '1 500,00 €',
            'Actif',
            'Oui',
            'Non',
          ],
        ],
      ),
    )
  })
})
