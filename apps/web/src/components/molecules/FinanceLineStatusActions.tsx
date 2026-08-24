'use client'

import { Button } from '@/components/atoms/Button'
import { useFinanceLineStatus } from '@/lib/hooks/use-finance-line-status'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Props = { row: FacturationSuiviRow }

export function FinanceLineStatusActions({ row }: Props) {
  const status = useFinanceLineStatus()
  const lineId = row.financeLineId
  if (!lineId) return null
  const cancelled = Boolean(row.cancelled)
  return (
    <Button
      type="button"
      variant="outline"
      className="h-8 px-2 text-xs"
      disabled={status.busy}
      onClick={() => (cancelled ? status.restore(lineId) : status.cancel(lineId))}
    >
      {cancelled ? 'Restaurer' : 'Annuler'}
    </Button>
  )
}
