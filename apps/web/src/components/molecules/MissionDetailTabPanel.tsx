'use client'

import { Construction } from 'lucide-react'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import type { MissionTab } from '@/view-models/mission-tabs'
import type { MissionFormValues } from '@/view-models/mission-form.schema'
import { MISSION_TAB_META } from '@/view-models/mission-tab-meta'
import { EmptyState } from '@/components/atoms/EmptyState'
import { SectionCard } from '@/components/molecules/SectionCard'
import { MissionInfoForm } from '@/components/molecules/MissionInfoForm'
import { MissionStatusActions } from '@/components/molecules/MissionStatusActions'

type Ref = { id: string; name: string }

type Props = {
  tab: MissionTab
  mission: MissionDetailPayload
  jobTitles: Ref[]
  pharmacies: Ref[]
  recruiters: Ref[]
  submitting: boolean
  onUpdate: (data: MissionFormValues) => void
  onCreateJobTitle: (name: string) => Promise<Ref>
}

export function MissionDetailTabPanel(props: Props) {
  const meta = MISSION_TAB_META[props.tab]

  return (
    <SectionCard variant="glass" title={meta.title} description={meta.description} bodyClassName="p-5 sm:p-6">
      {props.tab === 'infos' ? (
        <div className="flex flex-col gap-5">
          <MissionStatusActions mission={props.mission} />
          <MissionInfoForm
            mission={props.mission}
            jobTitles={props.jobTitles}
            pharmacies={props.pharmacies}
            recruiters={props.recruiters}
            submitting={props.submitting}
            onSubmit={props.onUpdate}
            onCreateJobTitle={props.onCreateJobTitle}
          />
        </div>
      ) : null}
      {props.tab !== 'infos' ? (
        <EmptyState
          icon={Construction}
          title="Bientôt disponible"
          description={`Onglet ${meta.title} — issue ultérieure.`}
        />
      ) : null}
    </SectionCard>
  )
}
