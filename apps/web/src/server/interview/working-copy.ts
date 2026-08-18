import { TRPCError } from '@trpc/server'
import type { InterviewMode } from '@prisma/client'
import { parseAdminSections } from '@/view-models/interview-admin-sections'
import type {
  InterviewTemplateWorkingCopy,
  TemplateAdminStore,
} from '@/server/interview/template-admin-types'

function toCopy(
  profileKey: string,
  mode: InterviewMode,
  label: string,
  sections: unknown,
): InterviewTemplateWorkingCopy {
  return { profileKey, mode, label, sections: parseAdminSections(sections) }
}

export async function getInterviewWorkingCopy(
  profileKey: string,
  mode: InterviewMode,
  store: TemplateAdminStore,
): Promise<InterviewTemplateWorkingCopy> {
  const existing = await store.findWorkingCopy(profileKey, mode)
  if (existing) return toCopy(profileKey, mode, existing.label, existing.sections)
  const published = await store.findPublished(profileKey, mode)
  if (!published) throw new TRPCError({ code: 'NOT_FOUND' })
  const copy = toCopy(profileKey, mode, published.label, published.sections)
  await store.upsertWorkingCopy(copy)
  return copy
}

export async function saveInterviewWorkingCopy(
  copy: InterviewTemplateWorkingCopy,
  store: TemplateAdminStore,
): Promise<InterviewTemplateWorkingCopy> {
  const next = toCopy(copy.profileKey, copy.mode, copy.label, copy.sections)
  await store.upsertWorkingCopy(next)
  return next
}
