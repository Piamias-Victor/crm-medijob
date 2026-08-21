import type { BoardApplication } from '@/server/job-board/applications-port'
import { toIngestApplication, type IngestApplication } from '@/server/application/sync-map'

export type SyncDeps = {
  listSubmissions: () => Promise<BoardApplication[]>
  listOwnedListingIds: () => Promise<string[]>
  findByBoardSubmissionIds: (ids: string[]) => Promise<Array<{ boardSubmissionId: string }>>
  createPending: (data: IngestApplication) => Promise<unknown>
}

export type SyncResult = { fetched: number; created: number; skipped: number }

export async function syncApplications(deps: SyncDeps): Promise<SyncResult> {
  const fetched = await deps.listSubmissions()
  const owned = new Set(await deps.listOwnedListingIds())
  const existing = await deps.findByBoardSubmissionIds(fetched.map((row) => row.id))
  const seen = new Set(existing.map((row) => row.boardSubmissionId))
  let created = 0
  let skipped = 0
  for (const row of fetched) {
    if (!row.offre_id || !owned.has(row.offre_id) || seen.has(row.id)) {
      skipped += 1
      continue
    }
    await deps.createPending(toIngestApplication(row))
    created += 1
  }
  return { fetched: fetched.length, created, skipped }
}
