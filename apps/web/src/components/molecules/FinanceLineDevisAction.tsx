'use client'

import { Button } from '@/components/atoms/Button'
import { useGenerateDevisFromLine } from '@/lib/hooks/use-generate-devis-from-line'
import { canGenerateDevisFromRow } from '@/view-models/facturation-line-actions'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Props = { row: FacturationSuiviRow }

export function FinanceLineDevisAction({ row }: Props) {
  const generate = useGenerateDevisFromLine()
  const lineId = row.financeLineId
  if (!canGenerateDevisFromRow(row) || !lineId) return null
  return (
    <Button
      type="button"
      variant="outline"
      className="h-8 px-2 text-xs"
      disabled={generate.isPending}
      onClick={() => generate.mutate({ id: lineId })}
    >
      {generate.isPending ? 'Génération…' : 'Générer un devis'}
    </Button>
  )
}
