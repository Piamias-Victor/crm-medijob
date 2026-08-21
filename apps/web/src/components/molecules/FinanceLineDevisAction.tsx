'use client'

import { Button } from '@/components/atoms/Button'
import { useGenerateDevisFromLine } from '@/lib/hooks/use-generate-devis-from-line'
import { useSendDevisFromLine } from '@/lib/hooks/use-send-devis-from-line'
import { canGenerateDevisFromRow, canSendDevisFromRow } from '@/view-models/facturation-line-actions'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Props = { row: FacturationSuiviRow }

export function FinanceLineDevisAction({ row }: Props) {
  const generate = useGenerateDevisFromLine()
  const send = useSendDevisFromLine()
  const lineId = row.financeLineId
  if (!lineId) return null
  const showGenerate = canGenerateDevisFromRow(row)
  const showSend = canSendDevisFromRow(row)
  if (!showGenerate && !showSend) return null
  return (
    <div className="flex justify-end gap-1">
      {showGenerate ? (
        <Button
          type="button"
          variant="outline"
          className="h-8 px-2 text-xs"
          disabled={generate.isPending}
          onClick={() => generate.mutate({ id: lineId })}
        >
          Générer
        </Button>
      ) : null}
      {showSend ? (
        <Button
          type="button"
          variant="outline"
          className="h-8 px-2 text-xs"
          disabled={send.pending}
          onClick={() => void send.send(row)}
        >
          Envoyer
        </Button>
      ) : null}
    </div>
  )
}
