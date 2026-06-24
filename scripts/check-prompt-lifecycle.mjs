#!/usr/bin/env node
/**
 * Ensures prompt lifecycle invariants:
 * - no PROMPT_ISSUE_{N}.md in both pending/ and done/
 * - pending/ must not contain prompts already present in done/
 */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const PENDING = join(ROOT, 'docs/prompts/pending')
const DONE = join(ROOT, 'docs/prompts/done')

function issueIds(dir) {
  return readdirSync(dir)
    .filter((name) => /^PROMPT_ISSUE_\d+\.md$/.test(name))
    .map((name) => name.match(/^PROMPT_ISSUE_(\d+)\.md$/)?.[1])
    .filter((id) => id != null)
}

const pendingIds = new Set(issueIds(PENDING))
const doneIds = new Set(issueIds(DONE))
const duplicates = [...pendingIds].filter((id) => doneIds.has(id))

if (duplicates.length > 0) {
  const list = duplicates
    .sort((a, b) => Number(a) - Number(b))
    .map((id) => `#${id} (docs/prompts/pending/PROMPT_ISSUE_${id.padStart(3, '0')}.md)`)
    .join('\n  - ')

  console.error(
    [
      'Prompt lifecycle violation: issue(s) present in BOTH pending/ and done/.',
      'Remove from pending/ (keep done/ only):',
      `  - ${list}`,
      '',
      'Fix: git rm docs/prompts/pending/PROMPT_ISSUE_{NNN}.md',
      'Never: git checkout origin/dev -- docs/prompts/pending/ (restores stale copies).',
    ].join('\n'),
  )
  process.exit(1)
}

console.log(`OK — ${pendingIds.size} pending, ${doneIds.size} done, no duplicates.`)
