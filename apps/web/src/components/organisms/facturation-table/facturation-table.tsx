'use client'

import { Receipt } from 'lucide-react'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import { facturationTableColumns } from '@/components/organisms/facturation-table/facturation-table-columns'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { ReactNode } from 'react'

type Props = {
  rows: FacturationSuiviRow[]
  renderActions?: (row: FacturationSuiviRow) => ReactNode
}

export function FacturationTable({ rows, renderActions }: Props) {
  return (
    <EntityTable
      rows={rows}
      columns={facturationTableColumns}
      getRowId={(row) => row.financeLineId ?? row.missionId ?? ''}
      getRowHref={(row) => (row.missionId ? `/missions/${row.missionId}` : '')}
      emptyIcon={Receipt}
      emptyTitle="Aucune ligne"
      emptyDescription="Créez une ligne ou ajustez les filtres."
      renderActions={renderActions}
    />
  )
}
