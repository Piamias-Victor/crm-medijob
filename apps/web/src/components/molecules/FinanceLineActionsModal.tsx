'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { Button } from '@/components/atoms/Button'
import { useFinanceLineStatus } from '@/lib/hooks/use-finance-line-status'
import { useGenerateDevisFromLine } from '@/lib/hooks/use-generate-devis-from-line'
import { useSendDevisFromLine } from '@/lib/hooks/use-send-devis-from-line'
import { canGenerateDevisFromRow, canSendDevisFromRow } from '@/view-models/facturation-line-actions'
import {
  FINANCE_LINE_ACTIONS,
  FINANCE_LINE_CANCEL,
  FINANCE_LINE_GENERATE_DEVIS,
  FINANCE_LINE_MARK_INVOICED,
  FINANCE_LINE_MARK_PAID,
  FINANCE_LINE_RESTORE,
  FINANCE_LINE_SEND_DEVIS,
} from '@/view-models/finance-line-copy'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Props = { row: FacturationSuiviRow; open: boolean; onClose: () => void }

export function FinanceLineActionsModal({ row, open, onClose }: Props) {
  const status = useFinanceLineStatus()
  const generate = useGenerateDevisFromLine()
  const send = useSendDevisFromLine()
  const lineId = row.financeLineId
  if (!lineId) return null
  const cancelled = Boolean(row.cancelled)
  const busy = status.busy || generate.isPending || send.pending
  const run = (action: () => void) => {
    action()
    onClose()
  }
  return (
    <GlassModal open={open} onClose={onClose} title={FINANCE_LINE_ACTIONS} className="max-w-sm">
      <div className="grid gap-2">
        <Button
          type="button"
          variant={row.invoiced ? 'accent' : 'outline'}
          disabled={busy}
          onClick={() => status.setInvoiced(lineId, !row.invoiced)}
        >
          {FINANCE_LINE_MARK_INVOICED}
        </Button>
        <Button
          type="button"
          variant={row.paid ? 'accent' : 'outline'}
          disabled={busy}
          onClick={() => status.setPaid(lineId, !row.paid)}
        >
          {FINANCE_LINE_MARK_PAID}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => run(() => (cancelled ? status.restore(lineId) : status.cancel(lineId)))}
        >
          {cancelled ? FINANCE_LINE_RESTORE : FINANCE_LINE_CANCEL}
        </Button>
        {canGenerateDevisFromRow(row) ? (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => run(() => generate.mutate({ id: lineId }))}
          >
            {FINANCE_LINE_GENERATE_DEVIS}
          </Button>
        ) : null}
        {canSendDevisFromRow(row) ? (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => run(() => void send.send(row))}
          >
            {FINANCE_LINE_SEND_DEVIS}
          </Button>
        ) : null}
      </div>
    </GlassModal>
  )
}
