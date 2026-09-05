import { readCommentsOrEmpty } from '@/server/badakan/read-comments'
import { badakanClientFromEnv } from '@/server/badakan/client'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { createAssistantProvider } from '@/server/ai/provider'
import { enrichFromComments } from '@/server/app-profile/enrich-from-comments'

export async function enrichAppCandidateFromComments(badakanId: string) {
  const client = badakanClientFromEnv()
  const comments = await readCommentsOrEmpty(() => client.getComments(badakanId))
  const [softwares, jobTitles] = await Promise.all([
    softwareRepository.list(),
    jobTitleRepository.list(),
  ])
  const provider = createAssistantProvider()
  return enrichFromComments({ softwares, jobTitles }, comments, (prompt) =>
    provider.complete({ kind: 'commentIntake', prompt }),
  )
}
