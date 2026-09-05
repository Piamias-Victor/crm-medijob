import { prisma } from '@/server/db/repositories/client'
import { createAssistantProvider } from '@/server/ai/provider'
import { makeActivityJobTitleAsker } from '@/server/ai/badakan-activity-job-title'
import {
  makeMissionReferentialResolver,
  type MissionReferentialDeps,
} from './resolve-referentials'

export function defaultMissionReferentialResolver() {
  const deps: MissionReferentialDeps = {
    listJobTitles: () => prisma.jobTitle.findMany({ select: { id: true, name: true } }),
    listSoftwares: () => prisma.software.findMany({ select: { id: true, name: true } }),
    askJobTitle: makeActivityJobTitleAsker(createAssistantProvider()),
  }
  return makeMissionReferentialResolver(deps)
}
