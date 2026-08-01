import { UserRound } from 'lucide-react'
import { QuickViewSection } from '@/components/molecules/quick-view-panel/quick-view-section'
import {
  PHARMACY_QUICK_VIEW_EMPTY,
  PHARMACY_QUICK_VIEW_SECTIONS,
} from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-copy'
import type { PharmacyQuickViewContact } from '@/view-models/pharmacy-quick-view.types'

type Props = { contacts: PharmacyQuickViewContact[] }

export function PharmacyQuickViewContacts({ contacts }: Props) {
  return (
    <QuickViewSection title={PHARMACY_QUICK_VIEW_SECTIONS.contacts} icon={UserRound}>
      {contacts.length === 0 ? (
        <p className="text-sm text-fg-muted">{PHARMACY_QUICK_VIEW_EMPTY.contacts}</p>
      ) : (
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-white/60 px-3 py-2.5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-muted text-sm font-semibold text-accent-hover">
                {contact.fullName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className="font-medium text-fg">{contact.fullName}</p>
                {contact.email ? (
                  <p className="truncate text-sm text-fg-muted">{contact.email}</p>
                ) : null}
                {contact.phone ? (
                  <p className="text-sm text-fg-muted">{contact.phone}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </QuickViewSection>
  )
}
