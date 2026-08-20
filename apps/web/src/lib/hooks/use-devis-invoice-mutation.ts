'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { DEVIS_INVOICE_SUCCESS } from '@/view-models/devis-copy'

export function useDevisInvoiceMutation() {
  const router = useRouter()
  return trpc.devis.markInvoiced.useMutation(
    useEntityMutation({
      successMessage: DEVIS_INVOICE_SUCCESS,
      onSuccess: () => router.refresh(),
    }),
  )
}
