import { INTERVIEW_GENERIC_PROFILE_KEY } from '@/view-models/interview-profile-key'

const PROFILE_KEY_PATTERN = /^[a-z][a-z0-9_]{0,62}$/

export function isAssignableInterviewProfileKey(key: string): boolean {
  return key !== INTERVIEW_GENERIC_PROFILE_KEY && PROFILE_KEY_PATTERN.test(key)
}

export function suggestInterviewProfileKey(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 63)
  return isAssignableInterviewProfileKey(slug) ? slug : 'metier'
}

export function canArchiveInterviewProfile(profileKey: string) {
  return profileKey !== INTERVIEW_GENERIC_PROFILE_KEY
}
