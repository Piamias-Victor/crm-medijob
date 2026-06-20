const EMAIL_PATTERN = /\b[\w.-]+@[\w.-]+\.\w{2,}\b/i
const PHONE_PATTERN = /\b0[1-9](?:[\s.-]?\d{2}){4}\b/

export type PiiGuardInput = {
  profile: string
  forbiddenTokens: string[]
}

export function assertAnonymizedProfileSafe({ profile, forbiddenTokens }: PiiGuardInput): void {
  const haystack = profile.toLowerCase()
  if (EMAIL_PATTERN.test(profile) || PHONE_PATTERN.test(profile)) {
    throw new Error('ANONYMIZED_CONTAINS_PII')
  }
  for (const token of forbiddenTokens) {
    const trimmed = token.trim()
    if (trimmed.length >= 3 && haystack.includes(trimmed.toLowerCase())) {
      throw new Error('ANONYMIZED_CONTAINS_PII')
    }
  }
}
