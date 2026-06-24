import { appendComposeQueryParams } from '@/lib/mailto/append-compose-query-params'
import type { MailtoParams } from '@/lib/mailto/build-mailto-url'

export function buildGmailComposeUrl({ to, cc, bcc, subject, body }: MailtoParams): string {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to })
  appendComposeQueryParams(params, { cc, bcc, subject, body, subjectKey: 'su' })
  return `https://mail.google.com/mail/?${params.toString()}`
}
