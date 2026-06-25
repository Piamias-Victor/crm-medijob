import Link from 'next/link'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'
import { pharmacyDetailHref } from '@/lib/pharmacy-href'

export function PharmacyTableActions({
  row,
  returnPath,
}: {
  row: PharmacyListRow
  returnPath: string
}) {
  return (
    <Link
      href={pharmacyDetailHref(row.id, returnPath)}
      className="inline-flex h-7 items-center rounded-md bg-accent px-2 text-xs font-medium text-accent-fg shadow-sm shadow-accent/20 transition-colors hover:bg-accent-hover"
    >
      Modifier
    </Link>
  )
}
