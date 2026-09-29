'use client'

import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { TruncatedText } from '@/components/molecules/TruncatedText'
import { AppIntakeStatusCell } from '@/components/molecules/AppIntakeStatusCell'
import { AppCallOutcomeCell } from '@/components/molecules/AppCallOutcomeCell'
import { AppIntakeRdvCell } from '@/components/molecules/AppIntakeRdvCell'
import { AppIntakeNotesCell } from '@/components/molecules/AppIntakeNotesCell'
import { AppReferentCell } from '@/components/molecules/AppReferentCell'
import { AppRelanceCell } from '@/components/molecules/AppRelanceCell'
import { AppIntakeActionsCell } from '@/components/molecules/AppIntakeActionsCell'
import {
  APP_CALL_OUTCOME_LABELS,
} from '@/view-models/app-profile-intake.labels'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Ref = { id: string; name: string }

export function buildAppIntakeOpsColumns(
  recruiters: readonly Ref[],
): ColumnDef<AppProfileListItem>[] {
  return [
    {
      id: 'intakeStatus',
      header: 'Statut',
      accessor: (row) => row.intakeStatusName,
      sortable: true,
      cell: (row) => <AppIntakeStatusCell row={row} />,
    },
    {
      id: 'callOutcome',
      header: 'Appel',
      accessor: (row) =>
        row.callOutcome ? APP_CALL_OUTCOME_LABELS[row.callOutcome] : TABLE_EMPTY_CELL,
      sortable: true,
      cell: (row) => <AppCallOutcomeCell row={row} />,
    },
    {
      id: 'plannedRdvAt',
      header: 'RDV',
      accessor: (row) =>
        row.plannedRdvAt ? new Date(row.plannedRdvAt).toLocaleDateString('fr-FR') : TABLE_EMPTY_CELL,
      sortable: true,
      cell: (row) => <AppIntakeRdvCell row={row} />,
    },
    {
      id: 'referent',
      header: 'Referent',
      accessor: (row) => row.referentName ?? TABLE_EMPTY_CELL,
      sortable: true,
      cell: (row) => <AppReferentCell row={row} recruiters={recruiters} />,
    },
    {
      id: 'relanceAt',
      header: 'Relance',
      accessor: (row) =>
        row.relanceAt ? new Date(row.relanceAt).toLocaleDateString('fr-FR') : TABLE_EMPTY_CELL,
      sortable: true,
      cell: (row) => <AppRelanceCell row={row} />,
    },
    {
      id: 'lastCalledAt',
      header: 'Dernier appel',
      accessor: (row) =>
        row.lastCalledAt
          ? `${new Date(row.lastCalledAt).toLocaleDateString('fr-FR')}${
              row.lastCalledByName ? ` · ${row.lastCalledByName}` : ''
            }`
          : TABLE_EMPTY_CELL,
      sortable: true,
      cell: (row) => (
        <TruncatedText
          text={
            row.lastCalledAt
              ? `${new Date(row.lastCalledAt).toLocaleDateString('fr-FR')}${
                  row.lastCalledByName ? ` · ${row.lastCalledByName}` : ''
                }`
              : null
          }
          className="max-w-[9rem]"
        />
      ),
    },
    {
      id: 'notes',
      header: 'Notes',
      accessor: (row) => row.notes ?? TABLE_EMPTY_CELL,
      cell: (row) => <AppIntakeNotesCell row={row} />,
    },
    {
      id: 'actions',
      header: '',
      accessor: () => '',
      cell: (row) => <AppIntakeActionsCell row={row} />,
    },
  ]
}
