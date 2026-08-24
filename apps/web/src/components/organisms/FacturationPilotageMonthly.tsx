'use client'

import { useState } from 'react'
import { PilotagePlainTable } from '@/components/molecules/PilotagePlainTable'
import { SectionCard } from '@/components/molecules/SectionCard'
import {
  PILOTAGE_MONTHLY_DETAIL_HEADERS,
  PILOTAGE_MONTHLY_HEADERS,
  PILOTAGE_MONTHLY_HINT,
  PILOTAGE_MONTHLY_TITLE,
  monthlyDetailCells,
  monthlyRowCells,
} from '@/view-models/facturation-pilotage-monthly-copy'
import type { PilotageMonthlyRow } from '@/view-models/facturation-pilotage-monthly'

export function FacturationPilotageMonthly({ monthly }: { monthly: PilotageMonthlyRow[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const detail = monthly.find((row) => row.month === selected)
  return (
    <SectionCard
      variant="glass"
      title={PILOTAGE_MONTHLY_TITLE}
      description={PILOTAGE_MONTHLY_HINT}
      bodyClassName="space-y-4 p-4 sm:p-5"
    >
      <PilotagePlainTable
        headers={PILOTAGE_MONTHLY_HEADERS}
        rows={monthly.map((row) => ({ id: row.month, cells: monthlyRowCells(row) }))}
        selectedId={selected}
        onRowClick={(id) => setSelected((current) => (current === id ? null : id))}
      />
      {detail && detail.lines.length > 0 ? (
        <PilotagePlainTable
          headers={PILOTAGE_MONTHLY_DETAIL_HEADERS}
          rows={detail.lines.map((line) => ({ id: line.id, cells: monthlyDetailCells(line) }))}
        />
      ) : null}
    </SectionCard>
  )
}
