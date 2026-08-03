import { buildComposeUrl } from '@/lib/mailto/build-compose-url'
import { buildSmsUrl } from '@/lib/phone/build-sms-url'
import { buildWhatsAppUrl } from '@/lib/phone/build-whatsapp-url'
import { isValidEmailRecipient } from '@/lib/mailto/is-valid-email-recipient'

export type MatchingContactCandidate = {
  candidateId: string
  email: string | null
  phone: string | null
}

type Params = {
  selected: MatchingContactCandidate[]
  subject: string
  body?: string
}

export type MatchingContactActions = {
  mailtoUrl: string | null
  smsUrls: string[]
  whatsappUrls: string[]
  emailCount: number
  phoneCount: number
}

export function resolveMatchingContactActions({
  selected,
  subject,
  body,
}: Params): MatchingContactActions {
  const emails = selected
    .map((row) => row.email?.trim() ?? '')
    .filter(isValidEmailRecipient)
  const smsUrls = selected
    .map((row) => buildSmsUrl(row.phone))
    .filter((url): url is string => Boolean(url))
  const whatsappUrls = selected
    .map((row) => buildWhatsAppUrl(row.phone))
    .filter((url): url is string => Boolean(url))
  const [to, ...rest] = emails

  return {
    mailtoUrl: to
      ? buildComposeUrl(
          {
            to,
            bcc: rest.length > 0 ? rest.join(',') : undefined,
            subject,
            body,
          },
          'gmail',
        )
      : null,
    smsUrls,
    whatsappUrls,
    emailCount: emails.length,
    phoneCount: smsUrls.length,
  }
}
