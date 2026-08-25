'use client'

import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { formatDevisPdfAmount, formatDevisPdfHours } from '@/view-models/devis-pdf-format'
import { INTERIM_PHARMACY_HEADERS } from '@/view-models/facturation-interim-copy'
import type { InterimPharmacyAggregate } from '@/view-models/facturation-interim-pharmacy'
import { formatDateFr } from '@/view-models/format-date-fr'

function money(value: number) {
  return <span className="whitespace-nowrap tabular-nums">{formatDevisPdfAmount(value)}</span>
}

export const interimPharmacyColumns: ColumnDef<InterimPharmacyAggregate>[] = [
  {
    id: 'pharmacy',
    header: INTERIM_PHARMACY_HEADERS.pharmacy,
    accessor: (row) => row.pharmacyName,
    sortable: true,
  },
  {
    id: 'count',
    header: INTERIM_PHARMACY_HEADERS.count,
    accessor: (row) => row.count,
    sortable: true,
  },
  {
    id: 'hours',
    header: INTERIM_PHARMACY_HEADERS.hours,
    accessor: (row) => row.hours,
    sortable: true,
    cell: (row) => (
      <span className="whitespace-nowrap tabular-nums">{formatDevisPdfHours(row.hours)}</span>
    ),
  },
  {
    id: 'ca',
    header: INTERIM_PHARMACY_HEADERS.ca,
    accessor: (row) => row.ca,
    sortable: true,
    cell: (row) => money(row.ca),
  },
  {
    id: 'marge',
    header: INTERIM_PHARMACY_HEADERS.marge,
    accessor: (row) => row.marge,
    sortable: true,
    cell: (row) => money(row.marge),
  },
  {
    id: 'caPerHour',
    header: INTERIM_PHARMACY_HEADERS.caPerHour,
    accessor: (row) => row.caPerHour,
    sortable: true,
    cell: (row) => money(row.caPerHour),
  },
  {
    id: 'margePerHour',
    header: INTERIM_PHARMACY_HEADERS.margePerHour,
    accessor: (row) => row.margePerHour,
    sortable: true,
    cell: (row) => money(row.margePerHour),
  },
  {
    id: 'lastDate',
    header: INTERIM_PHARMACY_HEADERS.lastDate,
    accessor: (row) => row.lastDate ?? '',
    sortable: true,
    cell: (row) => (row.lastDate ? formatDateFr(row.lastDate) : TABLE_EMPTY_CELL),
  },
]
