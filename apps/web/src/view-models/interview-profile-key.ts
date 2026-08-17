export const INTERVIEW_GENERIC_PROFILE_KEY = 'generique'

export function resolveInterviewProfileKey(profileKey: string | null | undefined): string {
  return profileKey ?? INTERVIEW_GENERIC_PROFILE_KEY
}
