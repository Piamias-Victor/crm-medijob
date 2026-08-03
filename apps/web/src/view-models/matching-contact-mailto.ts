import { buildMailtoUrl } from '@/lib/mailto/build-mailto-url'
import { isValidEmailRecipient } from '@/lib/mailto/is-valid-email-recipient'

type Params = {
  emails: string[]
  subject: string
  body?: string
}

export function buildMatchingContactMailto({ emails, subject, body }: Params): string | null {
  const valid = [...new Set(emails.map((e) => e.trim()).filter(isValidEmailRecipient))]
  const [to, ...rest] = valid
  if (!to) return null
  return buildMailtoUrl({
    to,
    bcc: rest.length > 0 ? rest.join(',') : undefined,
    subject,
    body,
  })
}
