'use client'

import { Button } from '@/components/atoms/Button'
import { useCan } from '@/lib/hooks/use-can'
import { useAppIntakeListKey } from '@/lib/hooks/use-app-intake-list-key'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { row: AppProfileListItem }

function useRemoveFromList(rowId: string) {
  const listKey = useAppIntakeListKey()
  const utils = trpc.useUtils()
  const push = useToastStore((s) => s.push)
  return {
    onMutate: async () => {
      await utils.appProfile.listIntakeFollowUp.cancel(listKey)
      const previous = utils.appProfile.listIntakeFollowUp.getData(listKey)
      utils.appProfile.listIntakeFollowUp.setData(listKey, (old) =>
        old?.filter((item) => item.id !== rowId),
      )
      return { previous }
    },
    onError: (
      error: { message: string },
      _input: unknown,
      ctx: { previous?: ReturnType<typeof utils.appProfile.listIntakeFollowUp.getData> } | undefined,
    ) => {
      if (ctx?.previous) utils.appProfile.listIntakeFollowUp.setData(listKey, ctx.previous)
      push({ variant: 'error', message: error.message })
    },
    onSuccess: (message: string) => () => push({ variant: 'success', message }),
  }
}

export function AppIntakeExitCell({ row }: Props) {
  const canWrite = useCan('crm.write')
  const opts = useRemoveFromList(row.id)
  const ignore = trpc.appProfile.ignore.useMutation({
    onMutate: opts.onMutate,
    onError: opts.onError,
    onSuccess: opts.onSuccess('Candidat ignoré'),
  })
  const qualify = trpc.appProfile.qualify.useMutation({
    onMutate: opts.onMutate,
    onError: opts.onError,
    onSuccess: opts.onSuccess('Candidat qualifié'),
  })

  if (!canWrite || row.status === 'IGNORE') return null

  const busy = ignore.isPending || qualify.isPending
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="px-2 py-1 text-xs"
        aria-label="Ignorer"
        disabled={busy}
        onClick={() => ignore.mutate({ id: row.id })}
      >
        ✗
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="px-2 py-1 text-xs"
        aria-label="Qualifié"
        disabled={busy || row.candidateId == null}
        onClick={() => qualify.mutate({ id: row.id })}
      >
        ✓
      </Button>
    </>
  )
}
