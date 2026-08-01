'use client'

import { QuickViewPanel } from '@/components/molecules/quick-view-panel/quick-view-panel'
import { ContactQuickViewContent } from '@/components/molecules/contact-quick-view/contact-quick-view-content'
import { CONTACT_QUICK_VIEW_LOADING } from '@/components/molecules/contact-quick-view/contact-quick-view-copy'
import { contactDetailHref } from '@/lib/contact-href'
import { trpc } from '@/lib/trpc/client'

type Props = {
  contactId: string | null
  returnPath: string
  onClose: () => void
}

export function ContactQuickView({ contactId, returnPath, onClose }: Props) {
  const query = trpc.contact.quickView.useQuery(
    { id: contactId ?? '' },
    { enabled: Boolean(contactId) },
  )
  const view = query.data
  const title = view?.fullName ?? CONTACT_QUICK_VIEW_LOADING

  return (
    <QuickViewPanel
      open={Boolean(contactId)}
      onClose={onClose}
      title={title}
      footerHref={contactId ? contactDetailHref(contactId, returnPath) : '#'}
    >
      {view ? (
        <ContactQuickViewContent view={view} />
      ) : (
        <p className="text-sm text-muted">{CONTACT_QUICK_VIEW_LOADING}</p>
      )}
    </QuickViewPanel>
  )
}
