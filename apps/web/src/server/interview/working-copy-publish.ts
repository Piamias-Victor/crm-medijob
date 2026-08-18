import { TRPCError } from '@trpc/server'
import type { InterviewMode } from '@prisma/client'
import { getInterviewWorkingCopy } from '@/server/interview/working-copy'
import { duplicateUniqueMappings } from '@/view-models/interview-duplicate-mappings'
import { INTERVIEW_TEMPLATE_DUPLICATE_MAPPING } from '@/view-models/interview-template-admin-copy'
import type {
  InterviewTemplateListRow,
  TemplateAdminStore,
} from '@/server/interview/template-admin-types'

export async function publishInterviewWorkingCopy(
  profileKey: string,
  mode: InterviewMode,
  store: TemplateAdminStore,
): Promise<InterviewTemplateListRow> {
  const copy = await getInterviewWorkingCopy(profileKey, mode, store)
  if (duplicateUniqueMappings(copy.sections).length > 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: INTERVIEW_TEMPLATE_DUPLICATE_MAPPING,
    })
  }
  const current = await store.findPublished(profileKey, mode)
  return store.createPublishedVersion({
    profileKey,
    mode,
    label: copy.label,
    sections: copy.sections,
    version: (current?.version ?? 0) + 1,
  })
}
