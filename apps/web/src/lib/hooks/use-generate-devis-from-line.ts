'use client'

import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { FINANCE_LINE_DEVIS_GENERATED } from '@/view-models/finance-line-copy'

export function useGenerateDevisFromLine() {
  const utils = trpc.useUtils()
  const toast = useEntityMutation({
    successMessage: FINANCE_LINE_DEVIS_GENERATED,
    onSuccess: () => {
      void utils.facturation.listSuivi.invalidate()
      void utils.facturation.overview.invalidate()
    },
  })
  return trpc.facturation.generateDevisFromLine.useMutation({
    onSuccess: toast.onSuccess,
    onError: toast.onError,
  })
}
