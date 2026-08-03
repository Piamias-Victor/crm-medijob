'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { MissionFormModal } from '@/components/molecules/MissionFormModal'

type Ref = { id: string; name: string }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pharmacies: Ref[]
  jobTitles: Ref[]
  recruiters: Ref[]
}

export function MissionsPageCreate({
  open,
  onOpenChange,
  pharmacies,
  jobTitles,
  recruiters,
}: Props) {
  const router = useRouter()
  const toast = useEntityMutation({ successMessage: 'Mission créée' })
  const refMutation = useEntityMutation()
  const create = trpc.mission.create.useMutation({
    onSuccess: (row) => {
      toast.onSuccess()
      onOpenChange(false)
      router.push(`/missions/${row.id}`)
    },
    onError: toast.onError,
  })
  const newJobTitle = trpc.mission.createJobTitle.useMutation(refMutation)

  return (
    <MissionFormModal
      open={open}
      pharmacies={pharmacies}
      jobTitles={jobTitles}
      recruiters={recruiters}
      submitting={create.isPending}
      onClose={() => onOpenChange(false)}
      onSubmit={(data) => create.mutate(data)}
      onCreateJobTitle={(name) => newJobTitle.mutateAsync({ name })}
    />
  )
}
