'use client'

import { useState } from 'react'
import type { DevisMissionView } from '@/view-models/devis'
import type { MissionQuoteState } from '@/view-models/mission-quote-state'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { DocumentListRow } from '@/view-models/document-list'
import type { MissionTab } from '@/view-models/mission-tabs'
import type { PipelineStageRef } from '@/view-models/mission-pipeline.types'
import type { RefItem } from '@/view-models/referential'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { MissionDetailHeader } from '@/components/molecules/MissionDetailHeader'
import { MissionDetailTabs } from '@/components/molecules/MissionDetailTabs'
import { MissionDetailTabPanel } from '@/components/molecules/MissionDetailTabPanel'
import { useMissionDetailMutations } from '@/lib/hooks/use-mission-detail-mutations'

type ContactRef = { id: string; label: string }

type Props = {
  mission: MissionDetailPayload
  pipelineStages: PipelineStageRef[]
  jobTitles: RefItem[]
  pharmacies: RefItem[]
  recruiters: RefItem[]
  contactsByPharmacy: Record<string, ContactRef[]>
  activities: ActivityLogRow[]
  documents: DocumentListRow[]
  devis: DevisMissionView
  quote: MissionQuoteState
  activityCount: number
  documentCount: number
  initialTab?: MissionTab
}

export function MissionDetailPage({
  mission,
  pipelineStages,
  jobTitles,
  pharmacies,
  recruiters,
  contactsByPharmacy,
  activities,
  documents,
  devis,
  quote,
  activityCount,
  documentCount,
  initialTab = 'infos',
}: Props) {
  const [tab, setTab] = useState<MissionTab>(initialTab)
  const { update, createJobTitle, onPharmacyChange } = useMissionDetailMutations()

  return (
    <EntityDetailShell
      header={<MissionDetailHeader mission={mission} commercialStatus={quote.commercialStatus} />}
      tabs={
        <MissionDetailTabs
          active={tab}
          onChange={setTab}
          pipelineCount={mission.candidates.length}
          activityCount={activityCount}
          documentCount={documentCount}
        />
      }
      tabKey={tab}
    >
      <MissionDetailTabPanel
        tab={tab}
        mission={mission}
        pipelineStages={pipelineStages}
        jobTitles={jobTitles}
        pharmacies={pharmacies}
        recruiters={recruiters}
        contactsByPharmacy={contactsByPharmacy}
        activities={activities}
        documents={documents}
        devis={devis}
        quote={quote}
        submitting={update.isPending}
        onUpdate={(data) => update.mutate({ id: mission.id, data })}
        onCreateJobTitle={(name) => createJobTitle.mutateAsync({ name })}
        onPharmacyChange={onPharmacyChange}
      />
    </EntityDetailShell>
  )
}
