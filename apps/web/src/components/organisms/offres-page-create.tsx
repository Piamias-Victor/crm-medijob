'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { JobOfferCreateModal } from '@/components/molecules/JobOfferCreateModal'
import {
  OPEN_MISSION_STATUSES,
  missionOffreHref,
  toMissionOfferPickerOptions,
} from '@/view-models/mission-offer-picker'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export function OffresPageCreate({ open, onOpenChange }: Props) {
  const router = useRouter()
  const [missionId, setMissionId] = useState('')
  const list = trpc.mission.list.useQuery(
    { statuses: [...OPEN_MISSION_STATUSES] },
    { enabled: open },
  )
  const options = toMissionOfferPickerOptions(list.data?.rows ?? [])

  return (
    <JobOfferCreateModal
      open={open}
      options={options}
      missionId={missionId}
      onMissionIdChange={setMissionId}
      onClose={() => onOpenChange(false)}
      onContinue={() => {
        if (!missionId) return
        onOpenChange(false)
        router.push(missionOffreHref(missionId))
      }}
    />
  )
}
