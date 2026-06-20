'use client'

import { Briefcase } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import type { PharmacyMissionRow } from '@/view-models/pharmacy-detail.types'
import type { MissionQuickCreateInput } from '@/view-models/mission-quick-create.schema'
import type { RefItem } from '@/view-models/referential'
import { STATUS_LABELS } from '@/lib/mission-options'
import { formatDateFr } from '@/view-models/format-date-fr'
import { MissionQuickCreateForm } from '@/components/molecules/MissionQuickCreateForm'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'
import { EntityLinkedMissionRow } from '@/components/molecules/EntityLinkedMissionRow'

type Props = {
  pharmacyId: string
  missions: PharmacyMissionRow[]
  jobTitles: RefItem[]
  recruiters: RefItem[]
  submitting: boolean
  onCreate: (data: MissionQuickCreateInput) => void
  onCreateJobTitle: (name: string) => Promise<RefItem>
}

export function PharmacyBesoinsTab({
  pharmacyId,
  missions,
  jobTitles,
  recruiters,
  submitting,
  onCreate,
  onCreateJobTitle,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      <MissionQuickCreateForm
        pharmacyId={pharmacyId}
        jobTitles={jobTitles}
        recruiters={recruiters}
        submitting={submitting}
        onSubmit={onCreate}
        onCreateJobTitle={onCreateJobTitle}
      />
      {missions.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Aucune mission active"
          description="Créez un besoin via le formulaire ci-dessus."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {missions.map((mission) => (
            <li key={mission.id}>
              <EntityLinkedMissionRow
                missionId={mission.id}
                title={mission.title}
                subtitle={`${mission.jobTitle} · ${STATUS_LABELS[mission.status]} · ${formatDateFr(mission.startDate)}`}
                meta={`Référent · ${mission.referent}`}
                trailing={
                  <MissionStatusBadge status={mission.status} className="px-2 py-0 text-[11px]" />
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
