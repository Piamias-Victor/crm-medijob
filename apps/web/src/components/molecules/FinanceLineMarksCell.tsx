'use client'

import { CheckboxChip } from '@/components/molecules/CheckboxChip'
import { useFinanceLineStatus } from '@/lib/hooks/use-finance-line-status'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Props = { row: FacturationSuiviRow }

export function FinanceLineMarksCell({ row }: Props) {
  const status = useFinanceLineStatus()
  const lineId = row.financeLineId
  if (!lineId) return null
  return (
    <div className="flex flex-wrap gap-1">
      <CheckboxChip
        label="Facturé"
        checked={Boolean(row.invoiced)}
        disabled={status.busy}
        onChange={(checked) => status.setInvoiced(lineId, checked)}
      />
      <CheckboxChip
        label="Encaissé"
        checked={Boolean(row.paid)}
        disabled={status.busy}
        onChange={(checked) => status.setPaid(lineId, checked)}
      />
    </div>
  )
}
