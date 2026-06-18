import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'apps/web/src'
const MAX = 100
const offenders = []

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full)
      continue
    }
    if (!/\.(ts|tsx)$/.test(entry)) continue
    const lines = readFileSync(full, 'utf8').split('\n').length
    if (lines > MAX) offenders.push(`${full} (${lines} lines)`)
  }
}

walk(ROOT)

if (offenders.length > 0) {
  console.error(`Files exceeding ${MAX} lines:\n${offenders.join('\n')}`)
  process.exit(1)
}
console.log(`All files under ${MAX} lines.`)
