'use client'

import { Building2, MapPin } from 'lucide-react'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'
import { CommercialStatusBadge } from '@/components/molecules/CommercialStatusBadge'
import type { CommercialStatus } from '@/lib/finance/derive-commercial-status'

type Props = { mission: MissionDetailPayload; commercialStatus: CommercialStatus }

export function MissionDetailHeader({ mission, commercialStatus }: Props) {
  return (
    <>
      <DetailPageHeader
        backHref="/missions"
        backLabel="Missions"
        name={mission.formSource.title}
        jobTitle={mission.jobTitleName}
        city={mission.city ?? undefined}
        referentName={mission.referentName ?? undefined}
        chips={[
          { icon: Building2, label: mission.pharmacyName },
          ...(mission.city ? [{ icon: MapPin, label: mission.city }] : []),
        ]}
      />
      <div className="flex flex-wrap items-center gap-2 px-1">
        <MissionStatusBadge status={mission.status} />
        <CommercialStatusBadge status={commercialStatus} />
      </div>
    </>
  )
}
