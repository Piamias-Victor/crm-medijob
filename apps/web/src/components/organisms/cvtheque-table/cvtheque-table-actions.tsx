import Link from 'next/link'
import { cvthequeCandidateHref } from '@/lib/cvtheque-candidate-href'
import type { CandidateTableRow } from '@/view-models/candidate-list-vm'

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
