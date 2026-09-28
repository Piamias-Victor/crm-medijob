'use client'

import { Button } from '@/components/atoms/Button'
import { useCan } from '@/lib/hooks/use-can'
import { useAppIntakeListKey } from '@/lib/hooks/use-app-intake-list-key'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { appIntakeExitActions } from '@/view-models/app-intake-exit-actions'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { row: AppProfileListItem }

const iconBtn =
  'size-8 shrink-0 rounded-full p-0 text-base font-semibold shadow-sm ring-1 ring-black/5'

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
  const { ignore: ignoreAction, qualify: qualifyAction } = appIntakeExitActions
  return (
    <>
      <Button
        type="button"
        variant={ignoreAction.variant}
        className={iconBtn}
        aria-label={ignoreAction.title}
        title={ignoreAction.title}
        disabled={busy}
        onClick={() => ignore.mutate({ id: row.id })}
      >
        {ignoreAction.label}
      </Button>
      <Button
        type="button"
        variant={qualifyAction.variant}
        className={iconBtn}
        aria-label={qualifyAction.title}
        title={qualifyAction.title}
        disabled={busy || row.candidateId == null}
        onClick={() => qualify.mutate({ id: row.id })}
      >
        {qualifyAction.label}
      </Button>
    </>
  )
}
