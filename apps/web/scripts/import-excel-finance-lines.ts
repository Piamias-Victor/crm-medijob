/**
 * One-shot Excel → FinanceLine.
 * Usage (from apps/web):
 *   pnpm exec tsx --env-file=.env scripts/import-excel-finance-lines.ts \
 *     --suivi ../../data/import/suivi-25-26.xlsx \
 *     --chiffre ../../data/import/chiffre-26-27.xlsx
 *   ... --apply
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { parseExcelWorkbook } from '@/lib/finance/excel-import-parse-workbook'
import { mergeExcelSources } from '@/lib/finance/excel-import-merge'
import { prepareImportRows } from '@/lib/finance/excel-import-prepare'
import { planExcelImport } from '@/lib/finance/excel-import-plan'
import { buildImportDryRunMarkdown } from '@/lib/finance/excel-import-report'
import { applyExcelImport } from '@/lib/finance/excel-import-apply'
import { makeExcelImportDbDeps } from '@/server/finance/excel-import.deps'
import { prisma } from '@/server/db/repositories/client'

function argValue(argv: string[], flag: string): string | null {
  const i = argv.indexOf(flag)
  return i >= 0 ? (argv[i + 1] ?? null) : null
}

async function loadCatalog() {
  const [pharmacies, candidates, users] = await Promise.all([
    prisma.pharmacy.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
    }),
    prisma.candidate.findMany({
      where: { deletedAt: null },
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
    }),
  ])
  return { pharmacies, candidates, users }
}

async function main() {
  const argv = process.argv.slice(2)
  const suiviPath = argValue(argv, '--suivi')
  const chiffrePath = argValue(argv, '--chiffre')
  const apply = argv.includes('--apply')
  if (!suiviPath || !chiffrePath) {
    console.error('Usage: --suivi path.xlsx --chiffre path.xlsx [--apply]')
    process.exit(1)
  }
  const suivi = await parseExcelWorkbook(readFileSync(suiviPath), 'suivi')
  const chiffre = await parseExcelWorkbook(readFileSync(chiffrePath), 'chiffre')
  const merged = mergeExcelSources(suivi.rows, chiffre.rows)
  const ignoredSheets = [...new Set([...suivi.ignoredSheets, ...chiffre.ignoredSheets])]
  const catalog = await loadCatalog()
  const prepared = prepareImportRows(merged.rows, catalog)
  const deps = makeExcelImportDbDeps()
  const dateIso = new Date().toISOString().slice(0, 10)
  if (!apply) {
    const existing = await deps.listExistingImportKeys()
    const plan = planExcelImport({
      prepared,
      existingKeys: existing,
      ignoredOverlap: merged.ignoredOverlapSuivi,
      ignoredSheets: ignoredSheets.length,
    })
    const md = buildImportDryRunMarkdown(plan, dateIso)
    const outDir = join(process.cwd(), '../../docs/audits/import-excel')
    mkdirSync(outDir, { recursive: true })
    const outPath = join(outDir, `${dateIso}-dry-run.md`)
    writeFileSync(outPath, md, 'utf8')
    console.log(`dry-run written: ${outPath}`)
    console.log(JSON.stringify(plan.counts))
    return
  }
  const { plan, created } = await applyExcelImport(
    prepared,
    { ignoredOverlap: merged.ignoredOverlapSuivi, ignoredSheets: ignoredSheets.length },
    deps,
  )
  console.log(JSON.stringify({ created, counts: plan.counts }))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
