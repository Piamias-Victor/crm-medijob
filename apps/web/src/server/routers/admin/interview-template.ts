import { router, adminProcedure } from '@/server/trpc'
import type { InterviewMode } from '@prisma/client'
import {
  interviewAdminWorkingCopySchema,
  interviewTemplateKeySchema,
  parseAdminSections,
} from '@/view-models/interview-admin-sections'
import { createInterviewTemplateSchema } from '@/view-models/interview-admin-create'
import { mergeInterviewTemplatePairs } from '@/view-models/interview-template-pairs'
import { getInterviewWorkingCopy, saveInterviewWorkingCopy } from '@/server/interview/working-copy'
import { publishInterviewWorkingCopy } from '@/server/interview/working-copy-publish'
import { createInterviewTemplate, type CreateInterviewTemplateInput } from '@/server/interview/working-copy-create'
import { archiveInterviewTemplate } from '@/server/interview/working-copy-archive'
import { liveTemplateAdminStore } from '@/server/interview/template-admin-store'
import { liveJobTitleKeyStore } from '@/server/interview/template-admin-job-titles'
import type {
  InterviewTemplateListRow,
  InterviewTemplateWorkingCopy,
} from '@/server/interview/template-admin-types'
import type { InterviewTemplatePairStatus } from '@/view-models/interview-template-pairs'

export type {
  InterviewTemplateListRow,
  InterviewTemplateWorkingCopy,
} from '@/server/interview/template-admin-types'

export type InterviewTemplateAdminDeps = {
  listPublished: () => Promise<InterviewTemplateListRow[]>
  listWorkingCopies: () => Promise<
    { profileKey: string; mode: InterviewMode; archivedAt: Date | null }[]
  >
  getWorkingCopy: (
    profileKey: string,
    mode: InterviewMode,
  ) => Promise<InterviewTemplateWorkingCopy>
  saveWorkingCopy: (copy: InterviewTemplateWorkingCopy) => Promise<InterviewTemplateWorkingCopy>
  publish: (profileKey: string, mode: InterviewMode) => Promise<InterviewTemplateListRow>
  create: (input: CreateInterviewTemplateInput) => Promise<InterviewTemplateWorkingCopy>
  archive: (profileKey: string, mode: InterviewMode) => Promise<void>
}

export function makeInterviewTemplateAdminRouter(deps: InterviewTemplateAdminDeps) {
  return router({
    list: adminProcedure.query(() => deps.listPublished()),
    listPairs: adminProcedure.query(async (): Promise<InterviewTemplatePairStatus[]> =>
      mergeInterviewTemplatePairs(await deps.listPublished(), await deps.listWorkingCopies()),
    ),
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
    create: adminProcedure
      .input(createInterviewTemplateSchema)
      .mutation(({ input }) => deps.create(input)),
    archive: adminProcedure
      .input(interviewTemplateKeySchema)
      .mutation(({ input }) => deps.archive(input.profileKey, input.mode)),
  })
}

export const interviewTemplateAdminRouter = makeInterviewTemplateAdminRouter({
  listPublished: () => liveTemplateAdminStore.listPublished(),
  listWorkingCopies: () => liveTemplateAdminStore.listWorkingCopies(),
  getWorkingCopy: (profileKey, mode) =>
    getInterviewWorkingCopy(profileKey, mode, liveTemplateAdminStore),
  saveWorkingCopy: (copy) => saveInterviewWorkingCopy(copy, liveTemplateAdminStore),
  publish: (profileKey, mode) =>
    publishInterviewWorkingCopy(profileKey, mode, liveTemplateAdminStore),
  create: (input) => createInterviewTemplate(input, liveTemplateAdminStore, liveJobTitleKeyStore),
  archive: (profileKey, mode) =>
    archiveInterviewTemplate(profileKey, mode, liveTemplateAdminStore),
})
