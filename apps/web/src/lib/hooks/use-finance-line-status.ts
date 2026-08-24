'use client'

import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { invalidateFacturationQueries } from '@/lib/hooks/invalidate-facturation-queries'
import { financeLineActionToast } from '@/view-models/finance-line-action-toast'

export function useFinanceLineStatus() {
  const utils = trpc.useUtils()
  const push = useToastStore((s) => s.push)
  const refresh = () => invalidateFacturationQueries(utils)
  const fail = (error: { message?: string }) => {
    push({ variant: 'error', message: error.message ?? 'Erreur' })
  }
  const cancel = trpc.facturation.cancelLine.useMutation({
    onSuccess: () => {
      refresh()
      push({ variant: 'success', message: financeLineActionToast.cancel })
    },
    onError: fail,
  })
  const restore = trpc.facturation.restoreLine.useMutation({
    onSuccess: () => {
      refresh()
      push({ variant: 'success', message: financeLineActionToast.restore })
    },
    onError: fail,
  })
  const invoiced = trpc.facturation.setInvoiced.useMutation({ onSuccess: refresh, onError: fail })
  const paid = trpc.facturation.setPaid.useMutation({ onSuccess: refresh, onError: fail })
  return {
    busy: cancel.isPending || restore.isPending || invoiced.isPending || paid.isPending,
    cancel: (id: string) => cancel.mutate({ id }),
    restore: (id: string) => restore.mutate({ id }),
    setInvoiced: (id: string, next: boolean) => invoiced.mutate({ id, invoiced: next }),
    setPaid: (id: string, next: boolean) => paid.mutate({ id, paid: next }),
  }
}
