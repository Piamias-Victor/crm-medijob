'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { JobOfferCreateModal } from '@/components/molecules/JobOfferCreateModal'
import { GlassModal } from '@/components/molecules/GlassModal'
import { StandaloneOfferCreateForm } from '@/components/molecules/StandaloneOfferCreateForm'
import { Button } from '@/components/atoms/Button'
import {
  OPEN_MISSION_STATUSES,
  missionOffreHref,
  toMissionOfferPickerOptions,
} from '@/view-models/mission-offer-picker'
import { jobOfferDetailHref } from '@/view-models/job-offer-href'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }
type Mode = 'pick' | 'mission' | 'standalone'

export function OffresPageCreate({ open, onOpenChange }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('pick')
  const [missionId, setMissionId] = useState('')
  const list = trpc.mission.list.useQuery(
    { statuses: [...OPEN_MISSION_STATUSES] },
    { enabled: open && mode === 'mission' },
  )
  const titles = trpc.mission.referentials.useQuery(undefined, {
    enabled: open && mode === 'standalone',
  })
  const options = toMissionOfferPickerOptions(list.data?.rows ?? [])
  const jobTitleOptions = (titles.data?.jobTitles ?? []).map((t: { id: string; name: string }) => ({
    value: t.id,
    label: t.name,
  }))

  const close = () => {
    setMode('pick')
    setMissionId('')
    onOpenChange(false)
  }

  const createOpts = useEntityMutation<{ id: string }>({
    successMessage: 'Offre créée',
    onSuccess: (data) => {
      close()
      if (data?.id) router.push(jobOfferDetailHref(data.id))
      else router.refresh()
    },
  })
  const create = trpc.jobOffer.createStandalone.useMutation(createOpts)

  if (!open) return null

  if (mode === 'pick') {
    return (
      <GlassModal open onClose={close} title="Créer une offre" className="max-w-md">
        <div className="flex flex-col gap-2">
          <Button type="button" variant="accent" onClick={() => setMode('mission')}>
            Depuis une mission
          </Button>
          <Button type="button" variant="outline" onClick={() => setMode('standalone')}>
            Sans mission
          </Button>
        </div>
      </GlassModal>
    )
  }

  if (mode === 'standalone') {
    return (
      <GlassModal open onClose={close} title="Offre sans mission" className="max-w-md">
        <StandaloneOfferCreateForm
          jobTitleOptions={jobTitleOptions}
          submitting={create.isPending}
          onCancel={close}
          onSubmit={(values) => create.mutate(values)}
        />
      </GlassModal>
    )
  }

  return (
    <JobOfferCreateModal
      open
      options={options}
      missionId={missionId}
      onMissionIdChange={setMissionId}
      onClose={close}
      onContinue={() => {
        if (!missionId) return
        close()
        router.push(missionOffreHref(missionId))
      }}
    />
  )
}
