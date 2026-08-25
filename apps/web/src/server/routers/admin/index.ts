import { router } from '@/server/trpc'
import { pipelineRouter } from '@/server/routers/admin/pipeline'
import { softwareRouter } from '@/server/routers/admin/software'
import { groupementRouter } from '@/server/routers/admin/groupement'
import { jobTitleRouter } from '@/server/routers/admin/job-title'
import { contactRoleRouter } from '@/server/routers/admin/contact-role'
import { userRouter } from '@/server/routers/admin/user'
import { interviewTemplateAdminRouter } from '@/server/routers/admin/interview-template'
import { objectifRouter } from '@/server/routers/admin/objectif'

export const adminRouter = router({
  pipeline: pipelineRouter,
  software: softwareRouter,
  groupement: groupementRouter,
  jobTitle: jobTitleRouter,
  contactRole: contactRoleRouter,
  user: userRouter,
  interviewTemplate: interviewTemplateAdminRouter,
  objectif: objectifRouter,
})
