import type { ImportExcelPlan } from '@/lib/finance/excel-import-plan'

/** Anonymized markdown report — counts and month totals only, never names. */
export function buildImportDryRunMarkdown(plan: ImportExcelPlan, dateIso: string): string {
  const c = plan.counts
  const lines = [
    `# Import Excel FinanceLine — dry-run ${dateIso}`,
    '',
    '## Counts',
    '',
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| read | ${c.read} |`,
    `| to create | ${c.toCreate} |`,
    `| already present | ${c.alreadyPresent} |`,
    `| ignored overlap (Suivi) | ${c.ignoredOverlap} |`,
    `| ignored sheets | ${c.ignoredSheets} |`,
    `| CA 0 | ${c.zeroCa} |`,
    `| unlinked pharmacy | ${c.unlinkedPharmacy} |`,
    `| unlinked candidate | ${c.unlinkedCandidate} |`,
    `| empty referent | ${c.emptyReferent} |`,
    '',
    '## Month reconciliation (Excel vs to-create)',
    '',
    `| Month | Excel CA | Import CA | Gap CA | Excel Marge | Import Marge | Gap Marge |`,
    `| --- | ---: | ---: | ---: | ---: | ---: | ---: |`,
  ]
  for (const m of plan.months) {
    lines.push(
      `| ${m.month} | ${m.excelCa} | ${m.importCa} | ${m.gapCa} | ${m.excelMarge} | ${m.importMarge} | ${m.gapMarge} |`,
    )
  }
  lines.push('')
  return lines.join('\n')
}
