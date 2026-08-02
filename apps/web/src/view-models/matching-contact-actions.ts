import { buildSmsUrl } from '@/lib/phone/build-sms-url'
import { buildWhatsAppUrl } from '@/lib/phone/build-whatsapp-url'
import { isValidEmailRecipient } from '@/lib/mailto/is-valid-email-recipient'
import { buildMatchingContactMailto } from '@/view-models/matching-contact-mailto'

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

  return {
    mailtoUrl: buildMatchingContactMailto({ emails, subject, body }),
    smsUrls,
    whatsappUrls,
    emailCount: emails.length,
    phoneCount: smsUrls.length,
  }
}
