export type ConsentSource = 'SITE' | 'MANUAL' | 'IMPORT'

export type ConsentInput = {
  consentGiven: boolean
  source: ConsentSource
  required?: boolean
}

export function resolveConsentFields(
  input: ConsentInput,
  now: Date = new Date(),
): { consentGivenAt: Date | null; consentSource: ConsentSource | null } {
  if (input.required && !input.consentGiven) {
    throw new Error('Consentement obligatoire pour cette source')
  }
  if (!input.consentGiven) {
    return { consentGivenAt: null, consentSource: null }
  }
  return { consentGivenAt: now, consentSource: input.source }
}
