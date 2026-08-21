'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { openDevisSendResult } from '@/lib/finance/open-devis-send-result'
import { DEVIS_SAVE_SUCCESS, DEVIS_SEND_SUCCESS } from '@/view-models/devis-copy'
import { toFinanceLineDevisInput, type FinanceLineFormValues } from '@/view-models/finance-line-form'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'

export type FinanceLineDevisPreview = {
  quote: DevisPdfModel
  values: FinanceLineFormValues
}

export function useFinanceLineDevisPreview() {
  const previewMut = trpc.facturation.previewDevis.useMutation(useEntityMutation())
  const saveMut = trpc.facturation.saveDevis.useMutation(
    useEntityMutation({ successMessage: DEVIS_SAVE_SUCCESS }),
  )
  const sendMut = trpc.facturation.sendDevis.useMutation(
    useEntityMutation({ successMessage: DEVIS_SEND_SUCCESS }),
  )
  const [preview, setPreview] = useState<FinanceLineDevisPreview | null>(null)
  const [devisId, setDevisId] = useState<string | null>(null)

  return {
    preview,
    devisId,
    previewing: previewMut.isPending,
    saving: saveMut.isPending,
    sending: sendMut.isPending,
    closePreview: () => setPreview(null),
    openPreview: async (values: FinanceLineFormValues) => {
      try {
        const result = await previewMut.mutateAsync(toFinanceLineDevisInput(values, devisId))
        setPreview({ quote: result.quote, values })
      } catch {
        return
      }
    },
    saveFromPreview: async () => {
      if (!preview) return
      try {
        const devis = await saveMut.mutateAsync(toFinanceLineDevisInput(preview.values, devisId))
        setDevisId(devis.id)
        setPreview(null)
      } catch {
        return
      }
    },
    sendFromPreview: async () => {
      if (!preview) return
      try {
        const result = await sendMut.mutateAsync(toFinanceLineDevisInput(preview.values, devisId))
        setDevisId(result.devis.id)
        openDevisSendResult(result)
        setPreview(null)
      } catch {
        return
      }
    },
  }
}
