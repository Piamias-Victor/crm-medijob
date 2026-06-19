'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight, Mail, Phone, Star, Users } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import type { PharmacyContactRow } from '@/view-models/pharmacy-detail.types'
import { ROLE_LABELS } from '@/lib/contact-options'

export function PharmacyContactsList({ contacts }: { contacts: PharmacyContactRow[] }) {
  const router = useRouter()

  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Aucun contact rattaché"
        description="Les interlocuteurs de cette officine apparaîtront ici."
      />
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <button
            type="button"
            onClick={() => router.push(`/contacts/${contact.id}`)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/55 bg-white/88 px-4 py-3 text-left text-sm shadow-sm transition-all hover:border-accent/45 hover:shadow-md hover:shadow-accent/8"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-fg">{contact.fullName}</p>
                {contact.isPrimary ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-muted px-2 py-0.5 text-[11px] font-medium text-accent-hover">
                    <Star className="size-3" aria-hidden />
                    Principal
                  </span>
                ) : null}
              </div>
              <p className="text-fg-muted">{ROLE_LABELS[contact.role]}</p>
              <div className="flex flex-wrap gap-3 text-xs text-fg-muted">
                {contact.phone ? (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="size-3" aria-hidden />
                    {contact.phone}
                  </span>
                ) : null}
                {contact.email ? (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="size-3" aria-hidden />
                    {contact.email}
                  </span>
                ) : null}
              </div>
            </div>
            <ChevronRight className="size-4 shrink-0 text-fg-muted" />
          </button>
        </li>
      ))}
    </ul>
  )
}
