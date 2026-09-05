import { sendOneAvailabilitySms } from './sms-due-one'
import type { AvailabilitySmsContact, SmsDueDeps } from './sms-due.types'

export type ResendSmsDeps = SmsDueDeps & {
  findContact: (candidateId: string) => Promise<AvailabilitySmsContact | null>
}

export async function resendAvailabilitySms(
  candidateId: string,
  deps: ResendSmsDeps,
): Promise<'sent' | 'skippedNoPhone' | 'not_app' | 'not_found'> {
  const contact = await deps.findContact(candidateId)
  if (!contact) return 'not_found'
  if (contact.origin !== 'APP') return 'not_app'
  return sendOneAvailabilitySms(
    { candidateId, firstName: contact.firstName, phone: contact.phone },
    deps,
  )
}
