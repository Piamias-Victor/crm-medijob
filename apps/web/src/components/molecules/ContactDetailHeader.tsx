'use client'

import { User } from 'lucide-react'
import Link from 'next/link'
import type { ContactDetailPayload } from '@/view-models/contact-detail.types'
import type { ContactTab } from '@/view-models/contact-tabs'
import { ROLE_LABELS } from '@/lib/contact-options'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { ContactTabs } from '@/components/molecules/ContactTabs'

type Props = {
  contact: ContactDetailPayload
  tab: ContactTab
  onTabChange: (tab: ContactTab) => void
  missionCount: number
  onSetPrimary: () => void
  settingPrimary: boolean
}

export function ContactDetailHeader({
  contact,
  tab,
  onTabChange,
  missionCount,
  onSetPrimary,
  settingPrimary,
}: Props) {
  return (
    <header className="rounded-xl border border-border bg-gradient-to-br from-primary-muted/50 via-white to-accent-muted/40 p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg shadow-md shadow-accent/30">
            <User className="size-5" />
          </span>
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-fg">{contact.fullName}</h1>
              <p className="mt-1 text-sm text-fg-muted">
                <Link href={`/pharmacies/${contact.pharmacy.id}`} className="hover:text-accent-hover">
                  {contact.pharmacy.name}
                </Link>
                {' · '}
                {ROLE_LABELS[contact.role]}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {contact.isPrimary ? <Badge variant="accent">Titulaire principal</Badge> : null}
              <Badge>{ROLE_LABELS[contact.role]}</Badge>
            </div>
            <ContactTabs active={tab} onChange={onTabChange} missionCount={missionCount} />
          </div>
        </div>
        {!contact.isPrimary ? (
          <Button variant="ghost" disabled={settingPrimary} onClick={onSetPrimary}>
            Définir titulaire principal
          </Button>
        ) : null}
      </div>
    </header>
  )
}
