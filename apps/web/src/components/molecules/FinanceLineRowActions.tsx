'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { FinanceLineActionsModal } from '@/components/molecules/FinanceLineActionsModal'
import { FinanceLineLinkControl } from '@/components/molecules/FinanceLineLinkControl'
import { FINANCE_LINE_ACTIONS } from '@/view-models/finance-line-copy'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Ref = { id: string; name: string }

type Props = {
  row: FacturationSuiviRow
  pharmacies: Ref[]
  candidates: Ref[]
}

export function FinanceLineRowActions({ row, pharmacies, candidates }: Props) {
  const [open, setOpen] = useState(false)
  if (!row.financeLineId) return null
  return (
    <div className="flex items-center gap-1">
      <FinanceLineLinkControl row={row} pharmacies={pharmacies} candidates={candidates} />
      <Button
        type="button"
        variant="outline"
        className="h-7 px-2 text-xs"
        onClick={() => setOpen(true)}
      >
        {FINANCE_LINE_ACTIONS}
      </Button>
      <FinanceLineActionsModal row={row} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
