'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { ExportCsvButton } from '@/components/molecules/export-csv-button/export-csv-button'
import {
  FACTURATION_LINE_CSV_HEADERS,
  facturationLineCsvRow,
} from '@/view-models/facturation-line-csv'
import { facturationLineTotals } from '@/view-models/facturation-line-totals'
import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Props = {
  rows: FacturationSuiviRow[]
  csvFilename: string
  createLabel: string
  onCreate: () => void
}

export function FacturationLinesHeader({ rows, csvFilename, createLabel, onCreate }: Props) {
  const totals = facturationLineTotals(rows)
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-fg-muted">
        {totals.count} ligne(s) — CA {formatDevisPdfAmount(totals.ca)} — Marge{' '}
        {formatDevisPdfAmount(totals.marge)}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <ExportCsvButton
          filename={csvFilename}
          headers={[...FACTURATION_LINE_CSV_HEADERS]}
          rows={rows.map(facturationLineCsvRow)}
        />
        <Button variant="accent" className="shadow-md shadow-accent/20" onClick={onCreate}>
          <Plus className="size-4" />
          {createLabel}
        </Button>
      </div>
    </div>
  )
}
