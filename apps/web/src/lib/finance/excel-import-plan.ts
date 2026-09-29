import type { PreparedImportRow } from '@/lib/finance/excel-import-prepare'

export type ImportExcelCounts = {
  read: number
  toCreate: number
  alreadyPresent: number
  ignoredOverlap: number
  ignoredSheets: number
  zeroCa: number
  unlinkedPharmacy: number
  unlinkedCandidate: number
  emptyReferent: number
}

export type MonthReconcile = {
  month: string
  excelCa: number
  excelMarge: number
  importCa: number
  importMarge: number
  gapCa: number
  gapMarge: number
}

export type ImportExcelPlan = {
  counts: ImportExcelCounts
  months: MonthReconcile[]
  toCreate: PreparedImportRow[]
}

export function planExcelImport(input: {
  prepared: PreparedImportRow[]
  existingKeys: Set<string>
  ignoredOverlap: number
  ignoredSheets: number
}): ImportExcelPlan {
  const toCreate: PreparedImportRow[] = []
  let alreadyPresent = 0
  let zeroCa = 0
  let unlinkedPharmacy = 0
  let unlinkedCandidate = 0
  let emptyReferent = 0
  const byMonth = new Map<string, { excelCa: number; excelMarge: number; importCa: number; importMarge: number }>()

  for (const row of input.prepared) {
    const bucket = byMonth.get(row.month) ?? {
      excelCa: 0,
      excelMarge: 0,
      importCa: 0,
      importMarge: 0,
    }
    bucket.excelCa += row.amountHt
    bucket.excelMarge += row.marge
    if (row.zeroCa) zeroCa += 1
    if (!row.pharmacyId) unlinkedPharmacy += 1
    if (!row.candidateId) unlinkedCandidate += 1
    if (!row.referentId) emptyReferent += 1
    if (input.existingKeys.has(row.importKey)) {
      alreadyPresent += 1
    } else {
      toCreate.push(row)
      bucket.importCa += row.amountHt
      bucket.importMarge += row.marge
    }
    byMonth.set(row.month, bucket)
  }

  const months: MonthReconcile[] = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, b]) => ({
      month,
      excelCa: b.excelCa,
      excelMarge: b.excelMarge,
      importCa: b.importCa,
      importMarge: b.importMarge,
      gapCa: round2(b.excelCa - b.importCa),
      gapMarge: round2(b.excelMarge - b.importMarge),
    }))

  return {
    counts: {
      read: input.prepared.length,
      toCreate: toCreate.length,
      alreadyPresent,
      ignoredOverlap: input.ignoredOverlap,
      ignoredSheets: input.ignoredSheets,
      zeroCa,
      unlinkedPharmacy,
      unlinkedCandidate,
      emptyReferent,
    },
    months,
    toCreate,
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}
