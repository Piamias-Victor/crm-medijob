'use client'

import { Receipt } from 'lucide-react'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import { facturationTableColumns } from '@/components/organisms/facturation-table/facturation-table-columns'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Props = { rows: FacturationSuiviRow[] }

export function FacturationTable({ rows }: Props) {
  return (
    <EntityTable
      rows={rows}
      columns={facturationTableColumns}
      getRowId={(row) => row.missionId}
      getRowHref={(row) => `/missions/${row.missionId}`}
      emptyIcon={Receipt}
      emptyTitle="Aucun devis"
      emptyDescription="Ajustez les filtres pour afficher des résultats."
    />
  )
}
