import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { Button } from '@/components/atoms/Button'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

export function buildAppProfileColumns(
  onAccept: (row: AppProfileListItem) => void,
  onIgnore: (row: AppProfileListItem) => void,
  busyId: string | null,
): ColumnDef<AppProfileListItem>[] {
  return [
    { id: 'lastName', header: 'Nom', accessor: (row) => row.lastName, sortable: true },
    { id: 'firstName', header: 'Prénom', accessor: (row) => row.firstName, sortable: true },
    { id: 'email', header: 'Email', accessor: (row) => row.email ?? TABLE_EMPTY_CELL },
    { id: 'city', header: 'Ville', accessor: (row) => row.city ?? TABLE_EMPTY_CELL },
    {
      id: 'metier',
      header: 'Métier',
      accessor: (row) => row.jobTitleName ?? row.activityLabel ?? TABLE_EMPTY_CELL,
    },
    {
      id: 'syncedAt',
      header: 'Sync',
      accessor: (row) => new Date(row.syncedAt).toLocaleDateString('fr-FR'),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="accent"
            className="h-8 px-2 text-xs"
            disabled={busyId === row.id}
            onClick={() => onAccept(row)}
          >
            Accepter
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-8 px-2 text-xs"
            disabled={busyId === row.id}
            onClick={() => onIgnore(row)}
          >
            Ignorer
          </Button>
        </div>
      ),
    },
  ]
}
