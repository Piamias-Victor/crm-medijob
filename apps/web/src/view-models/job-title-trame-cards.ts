import { resolveInterviewProfileKey } from '@/view-models/interview-profile-key'
import type { InterviewTemplatePairStatus } from '@/view-models/interview-template-pairs'

export function interviewTemplateEditorHref(
  profileKey: string | null | undefined,
  mode: 'INTERIM' | 'CDD_CDI',
): string {
  return `/admin/metiers/${resolveInterviewProfileKey(profileKey)}/${mode}`
}

export function jobTitleTrameKind(
  profileKey: string | null,
  mode: 'INTERIM' | 'CDD_CDI',
  pairs: InterviewTemplatePairStatus[],
): 'edit' | 'create' {
  if (!profileKey) return 'create'
  const pair = pairs.find((row) => row.profileKey === profileKey && row.mode === mode)
  return pair && !pair.archived ? 'edit' : 'create'
}
