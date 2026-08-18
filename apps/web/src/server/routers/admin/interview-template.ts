import { router, adminProcedure } from '@/server/trpc'
import type { InterviewMode } from '@prisma/client'
import {
  interviewAdminWorkingCopySchema,
  interviewTemplateKeySchema,
  parseAdminSections,
} from '@/view-models/interview-admin-sections'
import { getInterviewWorkingCopy, saveInterviewWorkingCopy } from '@/server/interview/working-copy'
import { publishInterviewWorkingCopy } from '@/server/interview/working-copy-publish'
import { liveTemplateAdminStore } from '@/server/interview/template-admin-store'
import type {
  InterviewTemplateListRow,
  InterviewTemplateWorkingCopy,
} from '@/server/interview/template-admin-types'

export type {
  InterviewTemplateListRow,
  InterviewTemplateWorkingCopy,
} from '@/server/interview/template-admin-types'

export type InterviewTemplateAdminDeps = {
  listPublished: () => Promise<InterviewTemplateListRow[]>
  getWorkingCopy: (
    profileKey: string,
    mode: InterviewMode,
  ) => Promise<InterviewTemplateWorkingCopy>
  saveWorkingCopy: (copy: InterviewTemplateWorkingCopy) => Promise<InterviewTemplateWorkingCopy>
  publish: (profileKey: string, mode: InterviewMode) => Promise<InterviewTemplateListRow>
}

export function makeInterviewTemplateAdminRouter(deps: InterviewTemplateAdminDeps) {
  return router({
    list: adminProcedure.query(() => deps.listPublished()),
    getWorkingCopy: adminProcedure
      .input(interviewTemplateKeySchema)
      .query(({ input }) => deps.getWorkingCopy(input.profileKey, input.mode)),
    saveWorkingCopy: adminProcedure
      .input(interviewAdminWorkingCopySchema)
      .mutation(({ input }) =>
        deps.saveWorkingCopy({ ...input, sections: parseAdminSections(input.sections) }),
      ),
    publish: adminProcedure
      .input(interviewTemplateKeySchema)
      .mutation(({ input }) => deps.publish(input.profileKey, input.mode)),
  })
}

export const interviewTemplateAdminRouter = makeInterviewTemplateAdminRouter({
  listPublished: () => liveTemplateAdminStore.listPublished(),
  getWorkingCopy: (profileKey, mode) =>
    getInterviewWorkingCopy(profileKey, mode, liveTemplateAdminStore),
  saveWorkingCopy: (copy) => saveInterviewWorkingCopy(copy, liveTemplateAdminStore),
  publish: (profileKey, mode) =>
    publishInterviewWorkingCopy(profileKey, mode, liveTemplateAdminStore),
})
