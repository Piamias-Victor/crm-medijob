'use client'

import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { AppIntakeStatusCell } from '@/components/molecules/AppIntakeStatusCell'
import { AppCallOutcomeCell } from '@/components/molecules/AppCallOutcomeCell'
import { AppIntakeRdvCell } from '@/components/molecules/AppIntakeRdvCell'
import { AppIntakeNotesCell } from '@/components/molecules/AppIntakeNotesCell'
import {
  APP_CALL_OUTCOME_LABELS,
  APP_INTAKE_STATUS_LABELS,
} from '@/view-models/app-profile-intake.labels'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

export function buildAppIntakeFollowUpColumns(): ColumnDef<AppProfileListItem>[] {
  return [
    { id: 'phone', header: 'Téléphone', accessor: (row) => row.phone ?? TABLE_EMPTY_CELL },
    { id: 'firstName', header: 'Prénom', accessor: (row) => row.firstName, sortable: true },
    { id: 'lastName', header: 'Nom', accessor: (row) => row.lastName, sortable: true },
    { id: 'email', header: 'Email', accessor: (row) => row.email ?? TABLE_EMPTY_CELL },
    {
      id: 'metier',
      header: 'Métier',
      accessor: (row) => row.jobTitleName ?? row.activityLabel ?? TABLE_EMPTY_CELL,
    },
    { id: 'city', header: 'Ville', accessor: (row) => row.city ?? TABLE_EMPTY_CELL },
    {
      id: 'postalCode',
      header: 'CP',
      accessor: (row) => row.postalCode ?? TABLE_EMPTY_CELL,
    },
    {
      id: 'enrolledAt',
      header: 'Inscrit le',
      accessor: (row) => new Date(row.createdAt).toLocaleDateString('fr-FR'),
      sortable: true,
    },
    {
      id: 'intakeStatus',
      header: 'Intake',
      accessor: (row) => APP_INTAKE_STATUS_LABELS[row.intakeStatus],
      cell: (row) => <AppIntakeStatusCell row={row} />,
    },
    {
      id: 'callOutcome',
      header: 'Appel',
      accessor: (row) =>
        row.callOutcome ? APP_CALL_OUTCOME_LABELS[row.callOutcome] : TABLE_EMPTY_CELL,
      cell: (row) => <AppCallOutcomeCell row={row} />,
    },
    {
      id: 'plannedRdvAt',
      header: 'RDV',
      accessor: (row) =>
        row.plannedRdvAt ? new Date(row.plannedRdvAt).toLocaleDateString('fr-FR') : TABLE_EMPTY_CELL,
      cell: (row) => <AppIntakeRdvCell row={row} />,
    },
    {
      id: 'notes',
      header: 'Notes',
      accessor: (row) => row.notes ?? TABLE_EMPTY_CELL,
      cell: (row) => <AppIntakeNotesCell row={row} />,
    },
  ]
}
