'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Table2 } from 'lucide-react'
import {
  CvthequeTableActions,
  cvthequeTableColumns,
} from '@/components/organisms/cvtheque-table/cvtheque-table-columns'
import { CvthequeFilterBar } from '@/components/organisms/cvtheque-table/cvtheque-filter-bar'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { CvthequeFilterValues } from '@/lib/filters/cvtheque-filter-map'
import { buildCvthequeReturnPath, cvthequeCandidateHref } from '@/lib/cvtheque-candidate-href'
import type { CandidateTableRow } from '@/view-models/candidate-list-vm'

type Props = {
  filterConfig: CvthequeFilterConfig
  values: CvthequeFilterValues
  onChange: (values: CvthequeFilterValues) => void
  onReset: () => void
  rows: CandidateTableRow[]
}

export function CvthequeTable({ filterConfig, values, onChange, onReset, rows }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const returnPath = useMemo(
    () => buildCvthequeReturnPath(pathname, searchParams.toString()),
    [pathname, searchParams],
  )
  const csvRows = useMemo(
    () =>
      rows.map((row) => [
        row.lastName,
        row.firstName,
        row.jobTitle ?? '',
        row.city ?? '',
        row.department ?? '',
        row.referent ?? '',
        row.availability,
      ]),
    [rows],
  )

  return (
    <div className="space-y-4">
      <CvthequeFilterBar
        filterConfig={filterConfig}
        values={values}
        onChange={onChange}
        onReset={onReset}
        csvHeaders={['Nom', 'Prénom', 'Métier', 'Ville', 'Département', 'Référent', 'Disponibilité']}
        csvRows={csvRows}
      />
      <EntityTable
        rows={rows}
        columns={cvthequeTableColumns}
        getRowId={(row) => row.id}
        getRowHref={(row) => cvthequeCandidateHref(row.id, returnPath)}
        emptyIcon={Table2}
        emptyTitle="Aucun candidat"
        emptyDescription="Ajustez les filtres pour afficher des résultats."
        renderActions={(row) => <CvthequeTableActions row={row} returnPath={returnPath} />}
      />
    </div>
  )
}
