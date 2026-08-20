'use client'

import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

export function useDevisPreviewMutation() {
  return trpc.devis.previewPdf.useMutation(useEntityMutation())
}
