import Link from 'next/link'
import { Eye } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { CANDIDATE_QUICK_VIEW_TRIGGER } from '@/components/molecules/candidate-quick-view/candidate-quick-view-copy'
import { cvthequeCandidateHref } from '@/lib/cvtheque-candidate-href'
import type { CandidateTableRow } from '@/view-models/candidate-list-vm'

export function CvthequeTableActions({
  row,
  returnPath,
  onQuickView,
}: {
  row: CandidateTableRow
  returnPath: string
  onQuickView: (id: string) => void
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        type="button"
        variant="outline"
        className="h-7 gap-1 px-2 text-xs"
        aria-label={CANDIDATE_QUICK_VIEW_TRIGGER}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onQuickView(row.id)
        }}
      >
        <Eye className="size-3.5" />
        Aperçu
      </Button>
      <Link
        href={cvthequeCandidateHref(row.id, returnPath)}
        className="inline-flex h-7 items-center rounded-md bg-accent px-2 text-xs font-medium text-accent-fg shadow-sm shadow-accent/20 transition-colors hover:bg-accent-hover"
        onClick={(event) => event.stopPropagation()}
      >
        Modifier
      </Link>
    </div>
  )
}
