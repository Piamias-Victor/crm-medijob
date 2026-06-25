import { appendComposeQueryParams } from '@/lib/mailto/append-compose-query-params'
import { GMAIL_COMPOSE_MAX_BODY_CHARS } from '@/lib/mailto/gmail-compose-limits'
import { truncateComposeBody } from '@/lib/mailto/truncate-compose-body'
import type { MailtoParams } from '@/lib/mailto/build-mailto-url'

export function buildGmailComposeUrl({ to, cc, bcc, subject, body }: MailtoParams): string {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to })
  const safeBody = body ? truncateComposeBody(body, GMAIL_COMPOSE_MAX_BODY_CHARS) : body
  appendComposeQueryParams(params, { cc, bcc, subject, body: safeBody, subjectKey: 'su' })
  return `https://mail.google.com/mail/?${params.toString()}`
}
