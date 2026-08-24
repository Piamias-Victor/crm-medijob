'use client'

import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { Badge } from '@/components/atoms/Badge'
import { CommercialStatusBadge } from '@/components/molecules/CommercialStatusBadge'
import { FacturationDateCell } from '@/components/molecules/FacturationDateCell'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { CONTRACT_TYPE_LABELS } from '@/lib/candidate-options'
import { formatDevisPdfOrEmpty } from '@/view-models/devis-pdf-format'
import { facturationRowOriginLabel } from '@/view-models/facturation-line-actions'
import { UNASSIGNED_REFERENT_LABEL } from '@/view-models/finance-line-referent'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export const facturationTableColumns: ColumnDef<FacturationSuiviRow>[] = [
  {
    id: 'pharmacyName',
    header: 'Pharmacie',
    accessor: (row) => row.pharmacyName,
    sortable: true,
  },
  {
    id: 'candidateName',
    header: 'Candidat',
    accessor: (row) => row.candidateName ?? TABLE_EMPTY_CELL,
    sortable: true,
  },
  {
    id: 'origin',
    header: 'Ligne',
    accessor: (row) => facturationRowOriginLabel(row),
    sortable: true,
    cell: (row) => (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        {facturationRowOriginLabel(row)}
        {row.cancelled ? (
          <Badge variant="error" className="px-2 py-0 text-[11px]">
            Annulé
          </Badge>
        ) : null}
      </span>
    ),
  },
  {
    id: 'referent',
    header: 'Référent',
    accessor: (row) => row.referentName ?? UNASSIGNED_REFERENT_LABEL,
    sortable: true,
  },
  {
    id: 'contractType',
    header: 'Contrat',
    accessor: (row) => CONTRACT_TYPE_LABELS[row.contractType],
    sortable: true,
  },
  {
    id: 'commercialStatus',
    header: 'État',
    accessor: (row) => row.commercialStatus,
    sortable: true,
    cell: (row) => (
      <CommercialStatusBadge status={row.commercialStatus} className="px-2 py-0 text-[11px]" />
    ),
  },
  {
    id: 'dates',
    header: 'Dates',
    accessor: (row) => row.acceptedAt ?? row.sentAt ?? '',
    sortable: true,
    cell: (row) => <FacturationDateCell row={row} />,
  },
  {
    id: 'amountHt',
    header: 'HT',
    accessor: (row) => formatDevisPdfOrEmpty(row.amountHt, TABLE_EMPTY_CELL),
    sortable: true,
    cell: (row) => (
      <span className="whitespace-nowrap tabular-nums">
        {formatDevisPdfOrEmpty(row.amountHt, TABLE_EMPTY_CELL)}
      </span>
    ),
  },
]
