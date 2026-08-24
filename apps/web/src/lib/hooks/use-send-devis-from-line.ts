'use client'

import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { openDevisSendResult } from '@/lib/finance/open-devis-send-result'
import { invalidateFacturationQueries } from '@/lib/hooks/invalidate-facturation-queries'
import { DEVIS_SEND_SUCCESS } from '@/view-models/devis-copy'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export function useSendDevisFromLine() {
  const utils = trpc.useUtils()
  const toast = useEntityMutation({
    successMessage: DEVIS_SEND_SUCCESS,
    onSuccess: () => invalidateFacturationQueries(utils),
  })
  const send = trpc.facturation.sendDevisFromLine.useMutation({
    onSuccess: (result) => {
      openDevisSendResult(result)
      toast.onSuccess()
    },
    onError: toast.onError,
  })

  return {
    pending: send.isPending,
    send: (row: FacturationSuiviRow) => {
      if (!row.financeLineId) return
      send.mutate({ id: row.financeLineId })
    },
  }
}
