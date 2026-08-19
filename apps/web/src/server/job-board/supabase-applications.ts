import type { JobBoardApplicationsPort } from '@/server/job-board/applications-port'
import { parseBoardApplications } from '@/server/job-board/parse-board-applications'
import {
  boardRestHeaders,
  boardRestUrl,
  throwBoardError,
  type JobsBoardConfig,
} from '@/server/job-board/supabase-rest'

type FetchFn = typeof fetch

export function createSupabaseApplicationsPort(
  config: JobsBoardConfig,
  fetchFn: FetchFn = fetch,
): JobBoardApplicationsPort {
  const url = boardRestUrl(config, 'candidatures')
  const auth = boardRestHeaders(config.secret)
  return {
    async listSubmissions() {
      const res = await fetchFn(url, { headers: auth })
      if (!res.ok) await throwBoardError(res)
      return parseBoardApplications(await res.json())
    },
  }
}
