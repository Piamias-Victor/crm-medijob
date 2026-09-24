'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { UpdateIntakeInput } from '@/view-models/app-profile-intake.schema'

type Patch = Partial<Omit<UpdateIntakeInput, 'id'>>

export function useAppIntakeUpdate(row: AppProfileListItem) {
  const router = useRouter()
  const opts = useEntityMutation({ onSuccess: () => router.refresh() })
  const mutation = trpc.appProfile.updateIntake.useMutation(opts)

  const save = (patch: Patch) => {
    mutation.mutate({
      id: row.id,
      intakeStatus: patch.intakeStatus ?? row.intakeStatus,
      callOutcome: patch.callOutcome !== undefined ? patch.callOutcome : row.callOutcome,
      plannedRdvAt: patch.plannedRdvAt !== undefined ? patch.plannedRdvAt : row.plannedRdvAt,
      notes: patch.notes !== undefined ? patch.notes : row.notes,
    })
  }

  return { save, isPending: mutation.isPending }
}
