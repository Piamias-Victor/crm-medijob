'use client'

import { Button } from '@/components/atoms/Button'
import { useCan } from '@/lib/hooks/use-can'
import { useAppIntakeListKey } from '@/lib/hooks/use-app-intake-list-key'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { row: AppProfileListItem }

export function AppIntakeIgnoreCell({ row }: Props) {
  const canWrite = useCan('crm.write')
  const listKey = useAppIntakeListKey()
  const utils = trpc.useUtils()
  const push = useToastStore((s) => s.push)
  const ignore = trpc.appProfile.ignore.useMutation({
    onMutate: async () => {
      await utils.appProfile.listIntakeFollowUp.cancel(listKey)
      const previous = utils.appProfile.listIntakeFollowUp.getData(listKey)
      utils.appProfile.listIntakeFollowUp.setData(listKey, (old) =>
        old?.filter((item) => item.id !== row.id),
      )
      return { previous }
    },
    onError: (error, _input, ctx) => {
      if (ctx?.previous) utils.appProfile.listIntakeFollowUp.setData(listKey, ctx.previous)
      push({ variant: 'error', message: error.message })
    },
    onSuccess: () => push({ variant: 'success', message: 'Entrée ignorée' }),
  })

  if (!canWrite) return null
  if (row.status === 'IGNORE' || row.status === 'APP_VALIDATED') return null

  return (
    <Button
      type="button"
      variant="ghost"
      className="px-2 py-1 text-xs"
      disabled={ignore.isPending}
      onClick={() => ignore.mutate({ id: row.id })}
    >
      {ignore.isPending ? 'Ignore…' : 'Ignorer'}
    </Button>
  )
}
