import { router } from '@/server/trpc'
import { healthRouter } from '@/server/routers/health'
import { authResetRouter } from '@/server/routers/auth-reset'
import { adminRouter } from '@/server/routers/admin'
import { pharmacyRouter } from '@/server/routers/pharmacy.adapter'
import { contactRouter } from '@/server/routers/contact.adapter'
import { assistantRouter } from '@/server/routers/assistant'
import { candidateRouter } from '@/server/routers/candidate.adapter'
import { missionCandidateRouter } from '@/server/routers/mission-candidate'
import { applicationRouter } from '@/server/routers/application'
import { appProfileRouter } from '@/server/routers/app-profile'
import { missionRouter } from '@/server/routers/mission.adapter'
import { jobOfferRouter } from '@/server/routers/job-offer.adapter'
import { activityLogRouter } from '@/server/routers/activity-log'
import { documentRouter } from '@/server/routers/document'
import { matchingRouter } from '@/server/routers/matching'
import { dashboardRouter } from '@/server/routers/dashboard'
import { searchRouter } from '@/server/routers/search'
import { interviewRouter } from '@/server/routers/interview'
import { devisRouter } from '@/server/routers/devis.adapter'
import { facturationRouter } from '@/server/routers/facturation.adapter'
import { badakanMissionRouter } from '@/server/routers/badakan-mission'
import { weeklyAvailabilityRouter } from '@/server/routers/weekly-availability'

export const appRouter = router({
  health: healthRouter,
  auth: authResetRouter,
  dashboard: dashboardRouter,
  search: searchRouter,
  admin: adminRouter,
  pharmacy: pharmacyRouter,
  contact: contactRouter,
  assistant: assistantRouter,
  candidate: candidateRouter,
  mission: missionRouter,
  missionCandidate: missionCandidateRouter,
  application: applicationRouter,
  appProfile: appProfileRouter,
  jobOffer: jobOfferRouter,
  activityLog: activityLogRouter,
  document: documentRouter,
  matching: matchingRouter,
  interview: interviewRouter,
  devis: devisRouter,
  facturation: facturationRouter,
  badakanMission: badakanMissionRouter,
  weeklyAvailability: weeklyAvailabilityRouter,
})

export type AppRouter = typeof appRouter
