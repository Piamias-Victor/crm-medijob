import { z } from 'zod'
import { INTERVIEW_MODE_LABELS } from '@/view-models/interview-labels'
import { INTERVIEW_TEMPLATE_EMPTY_SOURCE } from '@/view-models/interview-template-admin-copy'

export const createInterviewTemplateSchema = z.object({
  jobTitleId: z.string().min(1),
  mode: z.enum(['INTERIM', 'CDD_CDI']),
  profileKey: z.string().min(1).optional(),
  source: z
    .object({
      profileKey: z.string().min(1),
      mode: z.enum(['INTERIM', 'CDD_CDI']),
    })
    .optional(),
})

export type CreateInterviewTemplateForm = z.infer<typeof createInterviewTemplateSchema>

export function interviewTemplateSourceValue(profileKey: string, mode: string) {
  return `${profileKey}:${mode}`
}

export function parseInterviewTemplateSource(
  value: string,
): CreateInterviewTemplateForm['source'] {
  if (!value) return undefined
  const [profileKey, mode] = value.split(':')
  if (profileKey && (mode === 'INTERIM' || mode === 'CDD_CDI')) {
    return { profileKey, mode }
  }
  return undefined
}

export function interviewTemplateCopySourceOptions(
  published: { profileKey: string; mode: 'INTERIM' | 'CDD_CDI'; label: string }[],
) {
  return [
    { value: '', label: INTERVIEW_TEMPLATE_EMPTY_SOURCE },
    ...published.map((row) => ({
      value: interviewTemplateSourceValue(row.profileKey, row.mode),
      label: `${row.label} · ${INTERVIEW_MODE_LABELS[row.mode]}`,
    })),
  ]
}
