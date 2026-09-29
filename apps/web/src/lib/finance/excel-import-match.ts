import { firstReferentLabel, normalizeImportLabel } from '@/lib/finance/excel-import-normalize'

export type MatchCatalog = {
  pharmacies: Array<{ id: string; name: string }>
  candidates: Array<{ id: string; firstName: string; lastName: string }>
  users: Array<{ id: string; name: string }>
}

export type MatchResult = {
  pharmacyId: string | null
  candidateId: string | null
  referentId: string | null
  referentLabel: string
}

function candidateKeys(firstName: string, lastName: string): string[] {
  const a = normalizeImportLabel(`${firstName} ${lastName}`)
  const b = normalizeImportLabel(`${lastName} ${firstName}`)
  return a === b ? [a] : [a, b]
}

export function matchExcelLabels(
  labels: { pharmacyLabel: string; candidateLabel: string; referentLabel: string },
  catalog: MatchCatalog,
): MatchResult {
  const pNorm = normalizeImportLabel(labels.pharmacyLabel)
  const pharmacyId =
    catalog.pharmacies.find((p) => normalizeImportLabel(p.name) === pNorm)?.id ?? null
  const cNorm = normalizeImportLabel(labels.candidateLabel)
  const candidateId =
    catalog.candidates.find((c) => candidateKeys(c.firstName, c.lastName).includes(cNorm))?.id ??
    null
  const refLabel = firstReferentLabel(labels.referentLabel)
  const rNorm = normalizeImportLabel(refLabel)
  const referentId =
    refLabel === ''
      ? null
      : (catalog.users.find((u) => normalizeImportLabel(u.name) === rNorm)?.id ?? null)
  return { pharmacyId, candidateId, referentId, referentLabel: refLabel }
}
