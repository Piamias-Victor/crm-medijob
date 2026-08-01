'use client'

import { useMemo, useState } from 'react'
import type { ContactDetailPayload, ContactMissionRow } from '@/view-models/contact-detail.types'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { DocumentListRow } from '@/view-models/document-list'
import type { ContactTab } from '@/view-models/contact-tabs'
import type { RefItem } from '@/view-models/referential'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { ContactDetailTabs } from '@/components/molecules/ContactDetailTabs'
import { ContactDetailTabPanel } from '@/components/molecules/ContactDetailTabPanel'
import { useContactDetailMutations } from '@/lib/hooks/use-contact-detail-mutations'
import { Building2, Briefcase, Star } from 'lucide-react'

type Props = {
  contact: ContactDetailPayload
  missions: ContactMissionRow[]
  pharmacies: RefItem[]
  contactRoles: RefItem[]
  recruiters: RefItem[]
  activities: ActivityLogRow[]
  documents: DocumentListRow[]
  backHref?: string
}

export function ContactDetailPage({
  contact,
  missions,
  pharmacies,
  contactRoles,
  recruiters,
  activities,
  documents,
  backHref = '/contacts',
}: Props) {
  const [tab, setTab] = useState<ContactTab>('infos')
  const { update, setPrimary } = useContactDetailMutations()

  const headerChips = useMemo(
    () => [
      { icon: Building2, label: contact.pharmacy.name },
      { icon: Briefcase, label: contact.roleName },
      ...(contact.isPrimary
        ? [{ icon: Star, label: 'Titulaire principal', tone: 'accent' as const }]
        : []),
    ],
    [contact],
  )

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref={backHref}
          backLabel="Contacts"
          name={contact.fullName}
          chips={headerChips}
        />
      }
      tabs={<ContactDetailTabs active={tab} onChange={setTab} missionCount={missions.length} />}
      tabKey={tab}
    >
      <ContactDetailTabPanel
        tab={tab}
        contact={contact}
        missions={missions}
        pharmacies={pharmacies}
        contactRoles={contactRoles}
        recruiters={recruiters}
        activities={activities}
        documents={documents}
        updating={update.isPending}
        settingPrimary={setPrimary.isPending}
        onUpdate={(data) => update.mutate({ id: contact.id, data })}
        onSetPrimary={() => setPrimary.mutate({ id: contact.id })}
      />
    </EntityDetailShell>
  )
}
