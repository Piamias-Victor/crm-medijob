import { DEFAULT_COMPOSE_CLIENT, type ComposeClient } from '@/lib/mailto/compose-client'

function openGmailCompose(url: string): boolean {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.target = '_blank'
  anchor.rel = 'noopener noreferrer'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  return true
}

export function openEmailCompose(url: string, client: ComposeClient = DEFAULT_COMPOSE_CLIENT): boolean {
  if (client === 'gmail') return openGmailCompose(url)
  window.location.href = url
  return true
}
