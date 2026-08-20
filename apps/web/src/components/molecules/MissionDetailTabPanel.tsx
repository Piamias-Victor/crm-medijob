'use client'

import type { ActivityLogRow } from '@/view-models/activity-log'
import type { DocumentListRow } from '@/view-models/document-list'
import type { DevisMissionView } from '@/view-models/devis'
import type { MissionQuoteState } from '@/view-models/mission-quote-state'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import type { MissionTab } from '@/view-models/mission-tabs'
import type { MissionFormValues } from '@/view-models/mission-form.schema'
import type { PipelineStageRef } from '@/view-models/mission-pipeline.types'
import { MISSION_TAB_META } from '@/view-models/mission-tab-meta'
import { SectionCard } from '@/components/molecules/SectionCard'
import { EntityActivityLogTab } from '@/components/molecules/EntityActivityLogTab'
import { EntityDocumentsTab } from '@/components/molecules/EntityDocumentsTab'
import { MissionInfosTab } from '@/components/molecules/MissionInfosTab'
import { MissionPipelineSection } from '@/components/organisms/MissionPipelineSection'
import { MissionMatchingTab } from '@/components/organisms/MissionMatchingTab'
import { MissionOffreTab } from '@/components/organisms/MissionOffreTab'
import { MissionDevisTab } from '@/components/organisms/MissionDevisTab'

type Ref = { id: string; name: string }
type ContactRef = { id: string; label: string }

export type MissionDetailTabPanelProps = {
  tab: MissionTab
  mission: MissionDetailPayload
  pipelineStages: PipelineStageRef[]
  jobTitles: Ref[]
  pharmacies: Ref[]
  recruiters: Ref[]
  contactsByPharmacy: Record<string, ContactRef[]>
  activities: ActivityLogRow[]
  documents: DocumentListRow[]
  devis: DevisMissionView
  quote: MissionQuoteState
  submitting: boolean
  onUpdate: (data: MissionFormValues) => void
  onCreateJobTitle: (name: string) => Promise<Ref>
  onPharmacyChange: () => void
}

export function MissionDetailTabPanel(props: MissionDetailTabPanelProps) {
  const meta = MISSION_TAB_META[props.tab]
  return (
    <SectionCard variant="glass" title={meta.title} description={meta.description} bodyClassName="p-5 sm:p-6">
      {props.tab === 'infos' ? <MissionInfosTab {...props} /> : null}
      {props.tab === 'pipeline' ? (
        <MissionPipelineSection mission={props.mission} stages={props.pipelineStages} />
      ) : null}
      {props.tab === 'matching' ? (
        <MissionMatchingTab
          missionId={props.mission.id}
          missionStatus={props.mission.status}
          missionTitle={props.mission.formSource.title}
          jobTitleName={props.mission.jobTitleName}
          pharmacyName={props.mission.pharmacyName}
          positionedIds={props.mission.candidates.map((candidate) => candidate.id)}
        />
      ) : null}
      {props.tab === 'offre' ? <MissionOffreTab missionId={props.mission.id} /> : null}
      {props.tab === 'devis' ? (
        <MissionDevisTab
          missionId={props.mission.id}
          contractType={props.mission.formSource.contractType}
          heuresParSemaine={props.mission.formSource.heuresParSemaine}
          marge={props.mission.marge}
          devis={props.devis}
          quote={props.quote}
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
    </SectionCard>
  )
}
