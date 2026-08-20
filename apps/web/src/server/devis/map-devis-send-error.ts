import { TRPCError } from '@trpc/server'
import { documentBlobErrorMessage } from '@/lib/document-upload'
import { DEVIS_SEND_FAILED } from '@/view-models/devis-copy'
import { SendDevisError } from '@/server/devis/send-devis'

export function mapDevisSendError(error: unknown, fallback = DEVIS_SEND_FAILED): TRPCError {
  if (error instanceof SendDevisError) {
    return new TRPCError({ code: error.code, message: error.message })
  }
  console.error('[devis]', error)
  const text = error instanceof Error ? error.message : ''
  if (text.includes('Vercel Blob') || text.includes('Access denied') || text.includes('valid token')) {
    return new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: documentBlobErrorMessage(error) })
  }
  return new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: fallback })
}
