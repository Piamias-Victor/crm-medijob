'use client'

import { Building2, MapPin } from 'lucide-react'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'

type Props = { mission: MissionDetailPayload }

export function MissionDetailHeader({ mission }: Props) {
  return (
    <>
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
      <div className="px-1">
        <MissionStatusBadge status={mission.status} />
      </div>
    </>
  )
}
