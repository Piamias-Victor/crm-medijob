import Link from 'next/link'
import { Eye } from 'lucide-react'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'
import { pharmacyDetailHref } from '@/lib/pharmacy-href'
import { Button } from '@/components/atoms/Button'
import { PHARMACY_QUICK_VIEW_TRIGGER } from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-copy'

export function PharmacyTableActions({
  row,
  returnPath,
  onQuickView,
}: {
  row: PharmacyListRow
  returnPath: string
  onQuickView: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        type="button"
        variant="ghost"
        className="size-7 p-0"
        aria-label={PHARMACY_QUICK_VIEW_TRIGGER}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onQuickView(row.id)
        }}
      >
        <Eye className="size-4" />
      </Button>
      <Link
        href={pharmacyDetailHref(row.id, returnPath)}
        className="inline-flex h-7 items-center rounded-md bg-accent px-2 text-xs font-medium text-accent-fg shadow-sm shadow-accent/20 transition-colors hover:bg-accent-hover"
        onClick={(event) => event.stopPropagation()}
      >
        Modifier
      </Link>
    </div>
  )
}
