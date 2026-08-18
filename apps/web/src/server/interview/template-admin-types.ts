import type { InterviewMode } from '@prisma/client'
import type { InterviewAdminSection } from '@/view-models/interview-admin-sections'

export type InterviewTemplateListRow = {
  profileKey: string
  mode: InterviewMode
  version: number
  label: string
}

export type InterviewTemplateWorkingCopy = {
  profileKey: string
  mode: InterviewMode
  label: string
  sections: InterviewAdminSection[]
}

export type InterviewTemplateCopyRow = {
  profileKey: string
  mode: InterviewMode
  label: string
  sections: unknown
}

export type TemplateAdminStore = {
  listPublished: () => Promise<InterviewTemplateListRow[]>
  findPublished: (
    profileKey: string,
    mode: InterviewMode,
  ) => Promise<(InterviewTemplateListRow & { sections: unknown }) | null>
  findWorkingCopy: (
    profileKey: string,
    mode: InterviewMode,
  ) => Promise<InterviewTemplateCopyRow | null>
  upsertWorkingCopy: (copy: InterviewTemplateWorkingCopy) => Promise<InterviewTemplateCopyRow>
  createPublishedVersion: (
    row: InterviewTemplateListRow & { sections: unknown },
  ) => Promise<InterviewTemplateListRow>
}
