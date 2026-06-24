import Link from 'next/link'
import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { cvthequeCandidateHref } from '@/lib/cvtheque-candidate-href'
import type { CandidateTableRow } from '@/view-models/candidate-list-vm'

export const cvthequeTableColumns: ColumnDef<CandidateTableRow>[] = [
  { id: 'lastName', header: 'Nom', accessor: (row) => row.lastName, sortable: true },
  { id: 'firstName', header: 'Prénom', accessor: (row) => row.firstName, sortable: true },
  { id: 'jobTitle', header: 'Métier', accessor: (row) => row.jobTitle, sortable: true },
  { id: 'city', header: 'Ville', accessor: (row) => row.city, sortable: true },
  { id: 'department', header: 'Département', accessor: (row) => row.department, sortable: true },
  { id: 'referent', header: 'Référent', accessor: (row) => row.referent, sortable: true },
  { id: 'availability', header: 'Disponibilité', accessor: (row) => row.availability, sortable: true },
]

export function CvthequeTableActions({
  row,
  returnPath,
}: {
  row: CandidateTableRow
  returnPath: string
}) {
  return (
    <Link
      href={cvthequeCandidateHref(row.id, returnPath)}
      className="inline-flex h-7 items-center rounded-md bg-accent px-2 text-xs font-medium text-accent-fg shadow-sm shadow-accent/20 transition-colors hover:bg-accent-hover"
    >
      Modifier
    </Link>
  )
}
