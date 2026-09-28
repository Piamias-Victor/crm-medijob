/**
 * One-shot Syncro CANDIDATS → Entrées app.
 * Usage:
 *   cd apps/web
 *   pnpm exec tsx --env-file=.env scripts/import-syncro-entrees.ts --file /path/to/rows.json
 *   pnpm exec tsx --env-file=.env scripts/import-syncro-entrees.ts --file /path/to/rows.json --apply
 *
 * rows.json = matrix from sheet CANDIDATS (header + data), or { rows: SyncroSheetRow[] }.
 */
import { readFileSync } from 'node:fs'
import { importSyncroRows } from '@/server/app-profile/syncro-import'
import { defaultSyncroImportDeps } from '@/server/app-profile/syncro-import.deps'
import { parseSyncroCandidatsRows } from '@/view-models/syncro-import-parse'
import type { SyncroSheetRow } from '@/view-models/syncro-import.types'

function parseArgs(argv: string[]) {
  const fileIdx = argv.indexOf('--file')
  const file = fileIdx >= 0 ? argv[fileIdx + 1] : null
  const apply = argv.includes('--apply')
  return { file, dryRun: !apply }
}

function loadRows(file: string): SyncroSheetRow[] {
  const raw = JSON.parse(readFileSync(file, 'utf8')) as unknown
  if (Array.isArray(raw)) {
    if (raw.length > 0 && Array.isArray(raw[0])) {
      return parseSyncroCandidatsRows(raw as unknown[][])
    }
    return raw as SyncroSheetRow[]
  }
  if (raw && typeof raw === 'object' && Array.isArray((raw as { rows?: unknown }).rows)) {
    return (raw as { rows: SyncroSheetRow[] }).rows
  }
  throw new Error('JSON must be matrix, SyncroSheetRow[], or { rows }')
}

async function main() {
  const { file, dryRun } = parseArgs(process.argv.slice(2))
  if (!file) {
    console.error('Missing --file path.json')
    process.exit(1)
  }
  const dbUrl = process.env.DATABASE_URL ?? ''
  const host = dbUrl.match(/@([^/:?]+)/)?.[1] ?? ''
  if (host.includes('recette')) {
    console.error('Refusing Syncro import against RECETTE host:', host)
    process.exit(2)
  }
  if (!dryRun && !process.argv.includes('--allow-prod-write')) {
    console.error('Apply on prod requires --allow-prod-write (after mute-app-profile-outbound)')
    process.exit(2)
  }
  const rows = loadRows(file)
  const deps = await defaultSyncroImportDeps()
  const result = await importSyncroRows(rows, deps, { dryRun })
  console.log(JSON.stringify({ file, host, rowCount: rows.length, ...result }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
