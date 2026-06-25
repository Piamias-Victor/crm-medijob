import Link from 'next/link'
import type { ContactListRow } from '@/view-models/contact-list'
import { contactDetailHref } from '@/lib/contact-href'

export function ContactTableActions({
  row,
  returnPath,
}: {
  row: ContactListRow
  returnPath: string
}) {
  return (
    <Link
      href={contactDetailHref(row.id, returnPath)}
      className="inline-flex h-7 items-center rounded-md bg-accent px-2 text-xs font-medium text-accent-fg shadow-sm shadow-accent/20 transition-colors hover:bg-accent-hover"
    >
      Modifier
    </Link>
  )
}
