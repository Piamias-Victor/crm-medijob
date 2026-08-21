import { syncApplications } from '@/server/application/sync'
import { jobsBoardReadable, readJobsBoardEnv } from '@/server/job-board/env'
import { createSupabaseApplicationsPort } from '@/server/job-board/supabase-applications'
import { defaultApplicationDeps } from '@/server/routers/application.deps'

export async function runApplicationIngest() {
  const config = readJobsBoardEnv()
  if (!jobsBoardReadable(config)) return { skipped: true as const }
  const port = createSupabaseApplicationsPort({ url: config.url, secret: config.secret })
  return syncApplications({
    listSubmissions: () => port.listSubmissions(),
    listOwnedListingIds: () => defaultApplicationDeps.listOwnedListingIds(),
    findByBoardSubmissionIds: defaultApplicationDeps.findByBoardSubmissionIds,
    createPending: defaultApplicationDeps.createFromIngest,
  })
}

export function isCronAuthorized(header: string | null, secret = process.env.CRON_SECRET) {
  return Boolean(secret) && header === `Bearer ${secret}`
}
