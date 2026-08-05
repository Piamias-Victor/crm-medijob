'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'
import type { ContactListRow } from '@/view-models/contact-list'
import { contactDetailHref } from '@/lib/contact-href'
import { Button } from '@/components/atoms/Button'
import { ContactSoftDeleteButton } from '@/components/molecules/ContactSoftDeleteButton'
import { CONTACT_QUICK_VIEW_TRIGGER } from '@/components/molecules/contact-quick-view/contact-quick-view-copy'

export function ContactTableActions({
  row,
  returnPath,
  onQuickView,
}: {
  row: ContactListRow
  returnPath: string
  onQuickView: (id: string) => void
}) {
  const router = useRouter()
  const name = `${row.firstName} ${row.lastName}`.trim()

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        type="button"
        variant="outline"
        className="h-7 gap-1 px-2 text-xs"
        aria-label={CONTACT_QUICK_VIEW_TRIGGER}
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
