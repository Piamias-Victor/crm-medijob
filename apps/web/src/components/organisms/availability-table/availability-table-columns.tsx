'use client'

import { Badge } from '@/components/atoms/Badge'
import { CandidateContactLinks } from '@/components/molecules/CandidateContactLinks'
import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type { DeclaredAvailabilityRow } from '@/view-models/weekly-availability-declared-row'

export const availabilityTableColumns: ColumnDef<DeclaredAvailabilityRow>[] = [
  { id: 'fullName', header: 'Candidat', accessor: (row) => row.fullName, sortable: true },
  { id: 'jobTitleName', header: 'Métier', accessor: (row) => row.jobTitleName, sortable: true },
  {
    id: 'city',
    header: 'Ville',
    accessor: (row) => row.city ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'nextSlotLabel',
    header: 'Prochaine dispo',
    accessor: (row) => row.nextSlotLabel,
    sortable: true,
  },
  {
    id: 'halfDayCount',
    header: 'Demi-journées',
    accessor: (row) => row.halfDayCount,
    sortable: true,
    cell: (row) => <Badge variant="primary">{row.halfDayLabel}</Badge>,
  },
  {
    id: 'phone',
    header: 'Contact',
    accessor: (row) => row.phone ?? TABLE_EMPTY_CELL,
    cell: (row) => <CandidateContactLinks row={row} />,
  },
]
