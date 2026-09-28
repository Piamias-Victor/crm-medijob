'use client'

import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { patchIntakeFollowUpList } from '@/view-models/patch-intake-follow-up-list'
import { optimisticIntakeRow } from '@/view-models/optimistic-intake-row'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { UpdateIntakeInput } from '@/view-models/app-profile-intake.schema'
import type { ListIntakeFollowUpInput } from '@/view-models/app-profile-intake-list.schema'

type Patch = Partial<Omit<UpdateIntakeInput, 'id'>>
type ListKey = Pick<ListIntakeFollowUpInput, 'referentScope' | 'population'>

export function useAppIntakeUpdate(row: AppProfileListItem, listKey: ListKey) {
  const utils = trpc.useUtils()
  const push = useToastStore((s) => s.push)
  const population = listKey.population ?? 'default'

  const mutation = trpc.appProfile.updateIntake.useMutation({
    onMutate: async (input) => {
      await utils.appProfile.listIntakeFollowUp.cancel(listKey)
      const previous = utils.appProfile.listIntakeFollowUp.getData(listKey)
      const optimistic = optimisticIntakeRow(row, {
        intakeStatus: input.intakeStatus,
        callOutcome: input.callOutcome,
        plannedRdvAt: input.plannedRdvAt as Date | null | undefined,
        notes: input.notes,
        referentId: input.referentId,
        relanceAt: input.relanceAt as Date | null | undefined,
      })
      utils.appProfile.listIntakeFollowUp.setData(listKey, (old) =>
        patchIntakeFollowUpList(old, optimistic, population),
      )
      return { previous }
    },
    onError: (error, _input, ctx) => {
      if (ctx?.previous) utils.appProfile.listIntakeFollowUp.setData(listKey, ctx.previous)
      push({ variant: 'error', message: error.message })
    },
    onSuccess: (data) => {
      utils.appProfile.listIntakeFollowUp.setData(listKey, (old) =>
        patchIntakeFollowUpList(old, data, population),
      )
    },
  })

  const save = (patch: Patch) => {
    mutation.mutate({
      id: row.id,
      intakeStatus: patch.intakeStatus ?? row.intakeStatus,
      callOutcome: patch.callOutcome !== undefined ? patch.callOutcome : row.callOutcome,
      plannedRdvAt: patch.plannedRdvAt !== undefined ? patch.plannedRdvAt : row.plannedRdvAt,
      notes: patch.notes !== undefined ? patch.notes : row.notes,
      referentId: patch.referentId !== undefined ? patch.referentId : row.referentId,
      relanceAt: patch.relanceAt !== undefined ? patch.relanceAt : row.relanceAt,
    })
  }

  return { save, isPending: mutation.isPending }
}
