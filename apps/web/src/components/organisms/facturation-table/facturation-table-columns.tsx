'use client'

import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { CommercialStatusBadge } from '@/components/molecules/CommercialStatusBadge'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { CONTRACT_TYPE_LABELS } from '@/lib/candidate-options'
import { formatDateFr } from '@/view-models/format-date-fr'
import { formatDevisPdfOrEmpty } from '@/view-models/devis-pdf-format'
import { facturationRowOriginLabel } from '@/view-models/facturation-line-actions'
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
  },
  {
    id: 'referent',
    header: 'Référent',
    accessor: (row) => row.referentName ?? TABLE_EMPTY_CELL,
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
    header: 'État commercial',
    accessor: (row) => row.commercialStatus,
    sortable: true,
    cell: (row) => (
      <CommercialStatusBadge status={row.commercialStatus} className="px-2 py-0 text-[11px]" />
    ),
  },
  {
    id: 'sentAt',
    header: 'Envoyé le',
    accessor: (row) => (row.sentAt ? formatDateFr(row.sentAt) : TABLE_EMPTY_CELL),
    sortable: true,
  },
  {
    id: 'acceptedAt',
    header: 'Accepté le',
    accessor: (row) => (row.acceptedAt ? formatDateFr(row.acceptedAt) : TABLE_EMPTY_CELL),
    sortable: true,
  },
  {
    id: 'amountHt',
    header: 'HT',
    accessor: (row) => formatDevisPdfOrEmpty(row.amountHt, TABLE_EMPTY_CELL),
    sortable: true,
  },
]
