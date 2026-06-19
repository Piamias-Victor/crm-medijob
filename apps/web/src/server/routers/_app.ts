import { router } from '@/server/trpc'
import { healthRouter } from '@/server/routers/health'
import { adminRouter } from '@/server/routers/admin'
import { pharmacyRouter } from '@/server/routers/pharmacy'
import { contactRouter } from '@/server/routers/contact'
import { assistantRouter } from '@/server/routers/assistant'
import { candidateRouter } from '@/server/routers/candidate'
import { missionCandidateRouter } from '@/server/routers/mission-candidate'
import { applicationRouter } from '@/server/routers/application'
import { missionRouter } from '@/server/routers/mission'
import { jobOfferRouter } from '@/server/routers/job-offer'
import { activityLogRouter } from '@/server/routers/activity-log'

export const appRouter = router({
  health: healthRouter,
  admin: adminRouter,
  pharmacy: pharmacyRouter,
  contact: contactRouter,
  assistant: assistantRouter,
  candidate: candidateRouter,
  mission: missionRouter,
  missionCandidate: missionCandidateRouter,
  application: applicationRouter,
  jobOffer: jobOfferRouter,
  activityLog: activityLogRouter,
})

export type AppRouter = typeof appRouter
