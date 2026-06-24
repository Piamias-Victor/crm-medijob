'use client'

import { useMemo } from 'react'
import { Table2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { formatDateFr } from '@/view-models/format-date-fr'

type DemoRow = {
  id: string
  name: string
  city: string
  createdAt: Date
}

const names = ['Alice Martin', 'Bruno Dupont', 'Camille Durand', 'Émile Rousseau', 'Zoé Lambert']

function buildRows(): DemoRow[] {
  return Array.from({ length: 50 }, (_, index) => ({
    id: String(index + 1),
    name: `${names[index % names.length]} ${index + 1}`,
    city: index % 2 === 0 ? 'Lyon' : 'Paris',
    createdAt: new Date(2024, index % 12, (index % 27) + 1),
  }))
}

const columns: ColumnDef<DemoRow>[] = [
  { id: 'name', header: 'Nom', accessor: (row) => row.name, sortable: true },
  { id: 'city', header: 'Ville', accessor: (row) => row.city, sortable: true },
  {
    id: 'createdAt',
    header: 'Créé le',
    accessor: (row) => row.createdAt,
    sortable: true,
    cell: (row) => formatDateFr(row.createdAt),
  },
]

export function EntityTableShowcase() {
  const rows = useMemo(() => buildRows(), [])

  return (
    <EntityTable
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      emptyIcon={Table2}
      emptyTitle="Aucune ligne"
      emptyDescription="Ajoutez des données pour alimenter le tableau."
      renderActions={() => (
        <Button type="button" variant="ghost" className="px-2 py-1 text-xs">
          Ouvrir
        </Button>
      )}
    />
  )
}
