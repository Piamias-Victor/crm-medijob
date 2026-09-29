import { prisma } from '@/server/db/repositories/client'
import type { PreparedImportRow } from '@/lib/finance/excel-import-prepare'
import type { ExcelImportApplyDeps } from '@/lib/finance/excel-import-apply'

export function makeExcelImportDbDeps(): ExcelImportApplyDeps {
  return {
    listExistingImportKeys: async () => {
      const rows = await prisma.financeLine.findMany({
        where: { importKey: { not: null } },
        select: { importKey: true },
      })
      return new Set(rows.map((r) => r.importKey).filter((k): k is string => Boolean(k)))
    },
    createMany: async (rows: PreparedImportRow[]) => {
      const result = await prisma.$transaction(
        rows.map((row) =>
          prisma.financeLine.create({
            data: {
              kind: row.kind,
              source: 'EXCEL_IMPORT',
              pharmacyId: row.pharmacyId,
              candidateId: row.candidateId,
              pharmacyLabel: row.pharmacyLabel || null,
              candidateLabel: row.candidateLabel || null,
              referentLabel: row.referentLabelResolved || null,
              importKey: row.importKey,
              hours: row.hours,
              amountHt: row.amountHt,
              marge: row.marge,
              htSource: 'TYPED',
              occurredAt: row.occurredAt,
              referentId: row.referentId,
              placementContractType: row.placementContractType,
              invoiced: row.invoiced,
              paid: row.paid,
            },
          }),
        ),
      )
      return result.length
    },
  }
}
