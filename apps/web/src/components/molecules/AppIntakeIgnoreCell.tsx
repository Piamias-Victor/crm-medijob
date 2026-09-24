'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { useCan } from '@/lib/hooks/use-can'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { trpc } from '@/lib/trpc/client'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { row: AppProfileListItem }

export function AppIntakeIgnoreCell({ row }: Props) {
  const canWrite = useCan('crm.write')
  const router = useRouter()
  const opts = useEntityMutation({
    successMessage: 'Entrée ignorée',
    onSuccess: () => router.refresh(),
  })
  const ignore = trpc.appProfile.ignore.useMutation(opts)

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
