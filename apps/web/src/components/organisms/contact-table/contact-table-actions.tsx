'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ContactListRow } from '@/view-models/contact-list'
import { contactDetailHref } from '@/lib/contact-href'
import { ContactSoftDeleteButton } from '@/components/molecules/ContactSoftDeleteButton'

export function ContactTableActions({
  row,
  returnPath,
}: {
  row: ContactListRow
  returnPath: string
}) {
  const router = useRouter()
  const name = `${row.firstName} ${row.lastName}`.trim()

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={contactDetailHref(row.id, returnPath)}
        className="inline-flex h-7 items-center rounded-md bg-accent px-2 text-xs font-medium text-accent-fg shadow-sm shadow-accent/20 transition-colors hover:bg-accent-hover"
        onClick={(event) => event.stopPropagation()}
      >
        Modifier
      </Link>
      <ContactSoftDeleteButton
        contactId={row.id}
        contactName={name}
        compact
        onDeleted={() => router.refresh()}
      />
    </div>
  )
}
