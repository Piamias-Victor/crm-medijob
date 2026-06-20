'use client'

import type { ContactDetailPayload, ContactMissionRow } from '@/view-models/contact-detail.types'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { DocumentListRow } from '@/view-models/document-list'
import type { ContactTab } from '@/view-models/contact-tabs'
import type { ContactInput } from '@/view-models/contact-form.schema'
import { CONTACT_TAB_META } from '@/view-models/contact-tab-meta'
import { Button } from '@/components/atoms/Button'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ContactInfoForm } from '@/components/molecules/ContactInfoForm'
import { ContactMissionsTab } from '@/components/molecules/ContactMissionsTab'
import { EntityActivityLogTab } from '@/components/molecules/EntityActivityLogTab'
import { EntityDocumentsTab } from '@/components/molecules/EntityDocumentsTab'

type Ref = { id: string; name: string }

type Props = {
  tab: ContactTab
  contact: ContactDetailPayload
  missions: ContactMissionRow[]
  pharmacies: Ref[]
  activities: ActivityLogRow[]
  documents: DocumentListRow[]
  updating: boolean
  settingPrimary: boolean
  onUpdate: (data: ContactInput) => void
  onSetPrimary: () => void
}

export function ContactDetailTabPanel({
  tab,
  contact,
  missions,
  pharmacies,
  activities,
  documents,
  updating,
  settingPrimary,
  onUpdate,
  onSetPrimary,
}: Props) {
  const meta = CONTACT_TAB_META[tab]

  return (
    <SectionCard
      variant="glass"
      title={meta.title}
      description={meta.description}
      bodyClassName="p-5 sm:p-6"
      actions={
        tab === 'infos' && !contact.isPrimary ? (
          <Button variant="ghost" disabled={settingPrimary} onClick={onSetPrimary}>
            Définir titulaire principal
          </Button>
        ) : null
      }
    >
      {tab === 'infos' ? (
        <ContactInfoForm contact={contact} pharmacies={pharmacies} submitting={updating} onSubmit={onUpdate} />
      ) : null}
      {tab === 'historique' ? (
        <EntityActivityLogTab scope={{ entityType: 'CONTACT', entityId: contact.id }} initialLogs={activities} />
      ) : null}
      {tab === 'missions' ? <ContactMissionsTab missions={missions} /> : null}
      {tab === 'documents' ? (
        <EntityDocumentsTab
          entityType="CONTACT"
          entityId={contact.id}
          documents={documents}
          emptyLabel="Aucun document pour ce contact."
        />
      ) : null}
    </SectionCard>
  )
}
