import { router } from '@/server/trpc'
import { healthRouter } from '@/server/routers/health'
import { assistantRouter } from '@/server/routers/assistant'

export const appRouter = router({
  health: healthRouter,
  assistant: assistantRouter,
import { candidateRouter } from '@/server/routers/candidate'
import { missionCandidateRouter } from '@/server/routers/mission-candidate'
import { applicationRouter } from '@/server/routers/application'

export const appRouter = router({
  health: healthRouter,
  candidate: candidateRouter,
  missionCandidate: missionCandidateRouter,
  application: applicationRouter,
})

export type AppRouter = typeof appRouter
