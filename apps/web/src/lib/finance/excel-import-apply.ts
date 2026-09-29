import type { PreparedImportRow } from '@/lib/finance/excel-import-prepare'
import { planExcelImport, type ImportExcelPlan } from '@/lib/finance/excel-import-plan'

export type ExcelImportApplyDeps = {
  listExistingImportKeys: () => Promise<Set<string>>
  createMany: (rows: PreparedImportRow[]) => Promise<number>
}

export async function applyExcelImport(
  prepared: PreparedImportRow[],
  meta: { ignoredOverlap: number; ignoredSheets: number },
  deps: ExcelImportApplyDeps,
): Promise<{ plan: ImportExcelPlan; created: number }> {
  const existingKeys = await deps.listExistingImportKeys()
  const plan = planExcelImport({
    prepared,
    existingKeys,
    ignoredOverlap: meta.ignoredOverlap,
    ignoredSheets: meta.ignoredSheets,
  })
  const created = plan.toCreate.length === 0 ? 0 : await deps.createMany(plan.toCreate)
  return { plan, created }
}
