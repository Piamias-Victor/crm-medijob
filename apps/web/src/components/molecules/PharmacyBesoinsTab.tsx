'use client'

import { Briefcase } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import type { PharmacyMissionRow } from '@/view-models/pharmacy-detail.types'
import type { MissionQuickCreateInput } from '@/view-models/mission-quick-create.schema'
import { STATUS_LABELS } from '@/lib/mission-options'
import { MissionQuickCreateForm } from '@/components/molecules/MissionQuickCreateForm'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'

type Ref = { id: string; name: string }

type Props = {
  pharmacyId: string
  missions: PharmacyMissionRow[]
  jobTitles: Ref[]
  recruiters: Ref[]
  submitting: boolean
  onCreate: (data: MissionQuickCreateInput) => void
  onCreateJobTitle: (name: string) => Promise<Ref>
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('fr-FR').format(value)
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
            <li
              key={mission.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/55 bg-white/88 px-4 py-3 text-sm shadow-sm"
            >
              <div>
                <p className="font-medium text-fg">{mission.title}</p>
                <p className="text-fg-muted">
                  {mission.jobTitle} · {STATUS_LABELS[mission.status]} · {formatDate(mission.startDate)}
                </p>
                <p className="text-xs text-fg-muted">Référent · {mission.referent}</p>
              </div>
              <MissionStatusBadge status={mission.status} className="px-2 py-0 text-[11px]" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
