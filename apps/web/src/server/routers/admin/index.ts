import { router } from '@/server/trpc'
import { pipelineRouter } from '@/server/routers/admin/pipeline'
import { softwareRouter } from '@/server/routers/admin/software'
import { groupementRouter } from '@/server/routers/admin/groupement'
import { jobTitleRouter } from '@/server/routers/admin/job-title'

export const adminRouter = router({
  pipeline: pipelineRouter,
  software: softwareRouter,
  groupement: groupementRouter,
  jobTitle: jobTitleRouter,
})
