import { TRPCError } from '@trpc/server'
import type { InterviewMode } from '@prisma/client'
import { parseAdminSections } from '@/view-models/interview-admin-sections'
import { INTERVIEW_GENERIC_PROFILE_KEY } from '@/view-models/interview-profile-key'
import type { TemplateAdminStore } from '@/server/interview/template-admin-types'

export async function archiveInterviewTemplate(
  profileKey: string,
  mode: InterviewMode,
  store: TemplateAdminStore,
) {
  if (profileKey === INTERVIEW_GENERIC_PROFILE_KEY) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  const existing = await store.findWorkingCopy(profileKey, mode)
  if (!existing) {
    const published = await store.findPublished(profileKey, mode)
    if (!published) throw new TRPCError({ code: 'NOT_FOUND' })
    await store.upsertWorkingCopy({
      profileKey,
      mode,
      label: published.label,
      sections: parseAdminSections(published.sections),
    })
  }
  await store.setWorkingCopyArchived(profileKey, mode, new Date())
}
