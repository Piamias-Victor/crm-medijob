import { buildGmailComposeUrl } from '@/lib/mailto/build-gmail-compose-url'
import { buildMailtoUrl, type MailtoParams } from '@/lib/mailto/build-mailto-url'
import { DEFAULT_COMPOSE_CLIENT, type ComposeClient } from '@/lib/mailto/compose-client'

export function buildComposeUrl(
  params: MailtoParams,
  client: ComposeClient = DEFAULT_COMPOSE_CLIENT,
): string {
  return client === 'gmail' ? buildGmailComposeUrl(params) : buildMailtoUrl(params)
}
