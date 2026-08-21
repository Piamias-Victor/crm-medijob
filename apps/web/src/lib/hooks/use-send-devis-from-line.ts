'use client'

import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { openDevisSendResult } from '@/lib/finance/open-devis-send-result'
import { DEVIS_SEND_SUCCESS } from '@/view-models/devis-copy'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export function useSendDevisFromLine() {
  const utils = trpc.useUtils()
  const toast = useEntityMutation({
    successMessage: DEVIS_SEND_SUCCESS,
    onSuccess: () => {
      void utils.facturation.listSuivi.invalidate()
      void utils.facturation.overview.invalidate()
    },
  })
  const generate = trpc.facturation.generateDevisFromLine.useMutation()
  const send = trpc.devis.send.useMutation({
    onSuccess: (result) => {
      openDevisSendResult(result)
      toast.onSuccess()
    },
    onError: toast.onError,
  })

  return {
    pending: generate.isPending || send.isPending,
    send: async (row: FacturationSuiviRow) => {
      if (!row.financeLineId || !row.missionId) return
      try {
        if (!row.devisId) await generate.mutateAsync({ id: row.financeLineId })
        send.mutate({ missionId: row.missionId })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur'
        toast.onError({ message })
      }
    },
  }
}
