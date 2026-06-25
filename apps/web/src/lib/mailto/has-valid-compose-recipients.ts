import { isValidEmailRecipient } from '@/lib/mailto/is-valid-email-recipient'

type Args = {
  to?: string
  bcc?: string
}

export function splitComposeRecipients(value?: string) {
  return (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export function hasValidComposeRecipients({ to, bcc }: Args) {
  const toValue = to?.trim() ?? ''
  if (toValue && isValidEmailRecipient(toValue)) return true
  const bccRecipients = splitComposeRecipients(bcc)
  return bccRecipients.length > 0 && bccRecipients.every(isValidEmailRecipient)
}
