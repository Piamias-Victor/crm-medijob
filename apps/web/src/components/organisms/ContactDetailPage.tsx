'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Briefcase, Star } from 'lucide-react'
import type { ContactDetailPayload, ContactMissionRow } from '@/view-models/contact-detail.types'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { DocumentListRow } from '@/view-models/document-list'
import type { ContactTab } from '@/view-models/contact-tabs'
import { ROLE_LABELS } from '@/lib/contact-options'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { ContactDetailTabs } from '@/components/molecules/ContactDetailTabs'
import { ContactDetailTabPanel } from '@/components/molecules/ContactDetailTabPanel'

type Ref = { id: string; name: string }

type Props = {
  contact: ContactDetailPayload
  missions: ContactMissionRow[]
  pharmacies: Ref[]
  activities: ActivityLogRow[]
  documents: DocumentListRow[]
}

export function ContactDetailPage({ contact, missions, pharmacies, activities, documents }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<ContactTab>('infos')
  const mutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Contact enregistré',
  })
  const primaryMutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Contact principal mis à jour',
  })
  const update = trpc.contact.update.useMutation(mutation)
  const setPrimary = trpc.contact.setPrimary.useMutation(primaryMutation)

  const headerChips = useMemo(
    () => [
      { icon: Building2, label: contact.pharmacy.name },
      { icon: Briefcase, label: ROLE_LABELS[contact.role] },
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
          backHref="/contacts"
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
