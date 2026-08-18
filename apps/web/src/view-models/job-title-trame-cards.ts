import { resolveInterviewProfileKey } from '@/view-models/interview-profile-key'

export function interviewTemplateEditorHref(
  profileKey: string | null | undefined,
  mode: 'INTERIM' | 'CDD_CDI',
): string {
  return `/admin/metiers/${resolveInterviewProfileKey(profileKey)}/${mode}`
}
