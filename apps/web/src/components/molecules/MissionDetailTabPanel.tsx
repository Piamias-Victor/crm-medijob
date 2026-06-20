'use client'

import { Construction } from 'lucide-react'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { DocumentListRow } from '@/view-models/document-list'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import type { MissionTab } from '@/view-models/mission-tabs'
import type { MissionFormValues } from '@/view-models/mission-form.schema'
import type { PipelineStageRef } from '@/view-models/mission-pipeline.types'
import { MISSION_TAB_META } from '@/view-models/mission-tab-meta'
import { EmptyState } from '@/components/atoms/EmptyState'
import { SectionCard } from '@/components/molecules/SectionCard'
import { EntityActivityLogTab } from '@/components/molecules/EntityActivityLogTab'
import { EntityDocumentsTab } from '@/components/molecules/EntityDocumentsTab'
import { MissionInfoForm } from '@/components/molecules/MissionInfoForm'
import { MissionStatusActions } from '@/components/molecules/MissionStatusActions'
import { MissionPipelineSection } from '@/components/organisms/MissionPipelineSection'
import { MissionMatchingTab } from '@/components/organisms/MissionMatchingTab'

type Ref = { id: string; name: string }
type ContactRef = { id: string; label: string }

type Props = {
  tab: MissionTab
  mission: MissionDetailPayload
  pipelineStages: PipelineStageRef[]
  jobTitles: Ref[]
  pharmacies: Ref[]
  recruiters: Ref[]
  contactsByPharmacy: Record<string, ContactRef[]>
  activities: ActivityLogRow[]
  documents: DocumentListRow[]
  submitting: boolean
  onUpdate: (data: MissionFormValues) => void
  onCreateJobTitle: (name: string) => Promise<Ref>
  onPharmacyChange: () => void
}

export function MissionDetailTabPanel(props: Props) {
  const meta = MISSION_TAB_META[props.tab]

  return (
    <SectionCard variant="glass" title={meta.title} description={meta.description} bodyClassName="p-5 sm:p-6">
      {props.tab === 'infos' ? (
        <div className="flex flex-col gap-5">
          <MissionInfoForm
            mission={props.mission}
            jobTitles={props.jobTitles}
            pharmacies={props.pharmacies}
            recruiters={props.recruiters}
            contactsByPharmacy={props.contactsByPharmacy}
            submitting={props.submitting}
            onSubmit={props.onUpdate}
            onCreateJobTitle={props.onCreateJobTitle}
            onPharmacyChange={props.onPharmacyChange}
          />
          <MissionStatusActions mission={props.mission} />
        </div>
      ) : null}
      {props.tab === 'pipeline' ? (
        <MissionPipelineSection mission={props.mission} stages={props.pipelineStages} />
      ) : null}
      {props.tab === 'matching' ? (
        <MissionMatchingTab
          missionId={props.mission.id}
          missionStatus={props.mission.status}
          jobTitleName={props.mission.jobTitleName}
          pharmacyName={props.mission.pharmacyName}
          positionedIds={props.mission.candidates.map((candidate) => candidate.id)}
        />
      ) : null}
      {props.tab === 'historique' ? (
        <EntityActivityLogTab
          scope={{ entityType: 'MISSION', entityId: props.mission.id }}
          initialLogs={props.activities}
        />
      ) : null}
      {props.tab === 'documents' ? (
        <EntityDocumentsTab
          entityType="MISSION"
          entityId={props.mission.id}
          documents={props.documents}
          emptyLabel="Aucun document pour cette mission."
        />
      ) : null}
      {props.tab !== 'infos' &&
      props.tab !== 'pipeline' &&
      props.tab !== 'matching' &&
      props.tab !== 'historique' &&
      props.tab !== 'documents' ? (
        <EmptyState
          icon={Construction}
          title="Bientôt disponible"
          description={`Onglet ${meta.title} — issue ultérieure.`}
        />
      ) : null}
    </SectionCard>
  )
}
