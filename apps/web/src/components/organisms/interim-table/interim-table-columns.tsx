'use client'

import { Badge } from '@/components/atoms/Badge'
import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { InterimContractFiles } from '@/components/molecules/InterimContractFiles'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type { BadakanContractListItem } from '@/view-models/badakan-contract-list'
import type { BadakanEnterpriseListItem } from '@/view-models/badakan-enterprise-list'
import type { BadakanNeedListItem } from '@/view-models/badakan-need-list'
import type { BadakanMissionListItem } from '@/view-models/badakan-mission-list'
import { badakanContractStatusVariant } from '@/view-models/badakan-contract-status'
import { badakanMissionStepVariant } from '@/view-models/badakan-mission-step'

export const missionColumns: ColumnDef<BadakanMissionListItem>[] = [
  { id: 'pharmacyName', header: 'Officine', accessor: (row) => row.pharmacyName, sortable: true },
  { id: 'periodLabel', header: 'Période', accessor: (row) => row.periodLabel, sortable: true },
  {
    id: 'stepLabel',
    header: 'Statut',
    accessor: (row) => row.stepLabel,
    sortable: true,
    cell: (row) => <Badge variant={badakanMissionStepVariant(row.step)}>{row.stepLabel}</Badge>,
  },
]

export const needColumns: ColumnDef<BadakanNeedListItem>[] = [
  { id: 'pharmacyName', header: 'Officine', accessor: (row) => row.pharmacyName, sortable: true },
  { id: 'cityLabel', header: 'Ville', accessor: (row) => row.cityLabel, sortable: true },
  { id: 'jobTitleLabel', header: 'Métier', accessor: (row) => row.jobTitleLabel, sortable: true },
  { id: 'softwareLabel', header: 'LGO', accessor: (row) => row.softwareLabel, sortable: true },
  { id: 'periodLabel', header: 'Période', accessor: (row) => row.periodLabel, sortable: true },
  {
    id: 'stepLabel',
    header: 'Étape',
    accessor: (row) => row.stepLabel,
    sortable: true,
    cell: (row) => <Badge variant={badakanMissionStepVariant(row.step)}>{row.stepLabel}</Badge>,
  },
]

export const contractColumns: ColumnDef<BadakanContractListItem>[] = [
  { id: 'recipientName', header: 'Candidat', accessor: (row) => row.recipientName, sortable: true },
  { id: 'pharmacyName', header: 'Officine', accessor: (row) => row.pharmacyName, sortable: true },
  {
    id: 'statusLabel',
    header: 'Statut',
    accessor: (row) => row.statusLabel,
    sortable: true,
    cell: (row) => (
      <Badge variant={badakanContractStatusVariant(row.status)}>{row.statusLabel}</Badge>
    ),
  },
  {
    id: 'documents',
    header: 'Documents',
    accessor: (row) => (row.pdfHref ? 'PDF' : TABLE_EMPTY_CELL),
    cell: (row) => <InterimContractFiles row={row} />,
  },
]

export const enterpriseColumns: ColumnDef<BadakanEnterpriseListItem>[] = [
  { id: 'name', header: 'Officine', accessor: (row) => row.name, sortable: true },
  { id: 'cityLabel', header: 'Ville', accessor: (row) => row.cityLabel, sortable: true },
  { id: 'siretLabel', header: 'SIRET', accessor: (row) => row.siretLabel, sortable: true },
]
