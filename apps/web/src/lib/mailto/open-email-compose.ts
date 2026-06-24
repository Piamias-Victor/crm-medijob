import { DEFAULT_COMPOSE_CLIENT, type ComposeClient } from '@/lib/mailto/compose-client'

export function openEmailCompose(url: string, client: ComposeClient = DEFAULT_COMPOSE_CLIENT): boolean {
  if (client === 'gmail') {
    const opened = window.open(url, '_blank', 'noopener,noreferrer')
    return opened !== null
  }
  window.location.href = url
  return true
}
