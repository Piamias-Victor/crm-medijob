'use client'

import type { DocumentListRow } from '@/view-models/document-list'
import type { PharmacyDetailPayload } from '@/view-models/pharmacy-detail.types'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { PharmacyTab } from '@/view-models/pharmacy-tabs'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'
import type { MissionQuickCreateInput } from '@/view-models/mission-quick-create.schema'
import { EntityDocumentsTab } from '@/components/molecules/EntityDocumentsTab'
import { PharmacyInfoForm } from '@/components/molecules/PharmacyInfoForm'
import { PharmacyContactsTab } from '@/components/molecules/PharmacyContactsTab'
import { PharmacyBesoinsTab } from '@/components/molecules/PharmacyBesoinsTab'
import { EntityActivityLogTab } from '@/components/molecules/EntityActivityLogTab'

type Ref = { id: string; name: string }
type MissionRefs = { jobTitles: Ref[]; recruiters: Ref[] }

export type PharmacyDetailTabContentProps = {
  tab: PharmacyTab
  pharmacy: PharmacyDetailPayload
  groupements: Ref[]
  softwares: Ref[]
  missionRefs: MissionRefs
  documents: DocumentListRow[]
  submittingInfo: boolean
  submittingMission: boolean
  updateErrorMessage?: string | null
  onUpdate: (data: PharmacyInput) => void
  onCreateMission: (data: MissionQuickCreateInput) => void
  onCreateJobTitle: (name: string) => Promise<Ref>
  onSearchSiret: (query: string) => Promise<{ siret: string; name: string; address: string; city: string; postalCode: string }[]>
  onCreateGroupement: (name: string) => Promise<Ref>
  onCreateSoftware: (name: string) => Promise<Ref>
  activities: ActivityLogRow[]
}

export function PharmacyDetailTabContent(props: PharmacyDetailTabContentProps) {
  if (props.tab === 'infos') {
    return (
      <PharmacyInfoForm
        pharmacy={props.pharmacy}
        groupements={props.groupements}
        softwares={props.softwares}
        submitting={props.submittingInfo}
        errorMessage={props.updateErrorMessage}
        onSubmit={props.onUpdate}
        onSearchSiret={props.onSearchSiret}
        onCreateGroupement={props.onCreateGroupement}
        onCreateSoftware={props.onCreateSoftware}
      />
    )
  }
  if (props.tab === 'contacts') {
    return (
      <PharmacyContactsTab
        pharmacyId={props.pharmacy.id}
        pharmacyName={props.pharmacy.name}
        contacts={props.pharmacy.contacts}
      />
    )
  }
  if (props.tab === 'besoins') {
    return (
      <PharmacyBesoinsTab
        pharmacyId={props.pharmacy.id}
        missions={props.pharmacy.activeMissions}
        jobTitles={props.missionRefs.jobTitles}
        recruiters={props.missionRefs.recruiters}
        submitting={props.submittingMission}
        onCreate={props.onCreateMission}
        onCreateJobTitle={props.onCreateJobTitle}
      />
    )
  }
  if (props.tab === 'historique') {
    return (
      <EntityActivityLogTab
        scope={{ entityType: 'PHARMACY', entityId: props.pharmacy.id }}
        initialLogs={props.activities}
      />
    )
  }
  return (
    <EntityDocumentsTab
      entityType="PHARMACY"
      entityId={props.pharmacy.id}
      documents={props.documents}
      emptyLabel="Aucun document pour cette pharmacie."
    />
  )
}
