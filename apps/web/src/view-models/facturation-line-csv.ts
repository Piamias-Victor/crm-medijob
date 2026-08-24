import { buildCsv } from '@/lib/csv/build-csv'
import { CONTRACT_TYPE_LABELS } from '@/lib/candidate-options'
import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import { formatDateFr } from '@/view-models/format-date-fr'
import { UNASSIGNED_REFERENT_LABEL } from '@/view-models/finance-line-referent'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export const FACTURATION_LINE_CSV_HEADERS = [
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
] as const

function yesNo(value?: boolean) {
  return value ? 'Oui' : 'Non'
}

function money(value: number | null | undefined) {
  return value == null ? '' : formatDevisPdfAmount(value)
}

export function facturationLineCsvRow(row: FacturationSuiviRow): string[] {
  return [
    row.pharmacyName,
    row.candidateName ?? '',
    row.jobTitle ?? '',
    CONTRACT_TYPE_LABELS[row.contractType],
    row.referentName ?? UNASSIGNED_REFERENT_LABEL,
    row.acceptedAt ? formatDateFr(row.acceptedAt) : '',
    money(row.amountHt),
    money(row.marge),
    row.cancelled ? 'Annulé' : 'Actif',
    yesNo(row.invoiced),
    yesNo(row.paid),
  ]
}

export function buildFacturationLinesCsv(rows: FacturationSuiviRow[]): string {
  return buildCsv([...FACTURATION_LINE_CSV_HEADERS], rows.map(facturationLineCsvRow))
}
