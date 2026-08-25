'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { FinanceLineActionsModal } from '@/components/molecules/FinanceLineActionsModal'
import { FINANCE_LINE_ACTIONS } from '@/view-models/finance-line-copy'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Props = { row: FacturationSuiviRow }

export function FinanceLineRowActions({ row }: Props) {
  const [open, setOpen] = useState(false)
  if (!row.financeLineId) return null
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-7 px-2 text-xs"
        onClick={() => setOpen(true)}
      >
        {FINANCE_LINE_ACTIONS}
      </Button>
      <FinanceLineActionsModal row={row} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
