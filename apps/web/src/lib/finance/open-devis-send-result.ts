import { buildDocumentDownloadUrl } from '@/lib/document-preview'
import { openEmailCompose } from '@/lib/mailto/open-email-compose'

export function openDevisSendResult(result: { document: { id: string }; composeUrl: string }) {
  window.open(buildDocumentDownloadUrl(result.document.id), '_blank', 'noopener,noreferrer')
  openEmailCompose(result.composeUrl, 'gmail')
}
