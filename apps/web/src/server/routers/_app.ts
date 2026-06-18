import { router } from '@/server/trpc'
import { healthRouter } from '@/server/routers/health'
import { adminRouter } from '@/server/routers/admin'
import { pharmacyRouter } from '@/server/routers/pharmacy'
import { assistantRouter } from '@/server/routers/assistant'
import { candidateRouter } from '@/server/routers/candidate'
import { missionCandidateRouter } from '@/server/routers/mission-candidate'
import { applicationRouter } from '@/server/routers/application'

export const appRouter = router({
  health: healthRouter,
  admin: adminRouter,
  pharmacy: pharmacyRouter,
  assistant: assistantRouter,
  candidate: candidateRouter,
  missionCandidate: missionCandidateRouter,
  application: applicationRouter,
})

export type AppRouter = typeof appRouter
