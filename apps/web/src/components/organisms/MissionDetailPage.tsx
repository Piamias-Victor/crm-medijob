'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, MapPin } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { DocumentListRow } from '@/view-models/document-list'
import type { MissionTab } from '@/view-models/mission-tabs'
import type { PipelineStageRef } from '@/view-models/mission-pipeline.types'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { MissionDetailTabs } from '@/components/molecules/MissionDetailTabs'
import { MissionDetailTabPanel } from '@/components/molecules/MissionDetailTabPanel'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'

type Ref = { id: string; name: string }
type ContactRef = { id: string; label: string }

type Props = {
  mission: MissionDetailPayload
  pipelineStages: PipelineStageRef[]
  jobTitles: Ref[]
  pharmacies: Ref[]
  recruiters: Ref[]
  contactsByPharmacy: Record<string, ContactRef[]>
  activities: ActivityLogRow[]
  documents: DocumentListRow[]
  activityCount: number
  documentCount: number
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
  activityCount,
  documentCount,
}: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<MissionTab>('infos')
  const mutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Mission enregistrée',
  })
  const refMutation = useEntityMutation()
  const update = trpc.mission.update.useMutation(mutation)
  const createJobTitle = trpc.mission.createJobTitle.useMutation(refMutation)

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref="/missions"
          backLabel="Missions"
          name={mission.formSource.title}
          jobTitle={mission.jobTitleName}
          city={mission.city ?? undefined}
          referentName={mission.referentName}
          chips={[
            { icon: Building2, label: mission.pharmacyName },
            ...(mission.city ? [{ icon: MapPin, label: mission.city }] : []),
          ]}
        />
      }
      meta={
        <div className="px-1">
          <MissionStatusBadge status={mission.status} />
        </div>
      }
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
        submitting={update.isPending}
        onUpdate={(data) => update.mutate({ id: mission.id, data })}
        onCreateJobTitle={(name) => createJobTitle.mutateAsync({ name })}
        onPharmacyChange={() => router.refresh()}
      />
    </EntityDetailShell>
  )
}
