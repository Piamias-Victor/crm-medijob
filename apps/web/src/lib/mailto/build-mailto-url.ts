import { appendComposeQueryParams } from '@/lib/mailto/append-compose-query-params'

export type MailtoParams = {
  to: string
  cc?: string
  bcc?: string
  subject?: string
  body?: string
}

export function buildMailtoUrl({ to, cc, bcc, subject, body }: MailtoParams): string {
  const params = new URLSearchParams()
  appendComposeQueryParams(params, { cc, bcc, subject, body })
  const query = params.toString()
  return query ? `mailto:${to}?${query}` : `mailto:${to}`
}
