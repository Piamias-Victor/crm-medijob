'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { ReferentialManager } from '@/components/organisms/ReferentialManager'
import type { RefItem } from '@/view-models/referential'

export function GroupementAdmin({ items }: { items: RefItem[] }) {
  const router = useRouter()
  const mutation = useEntityMutation({ onSuccess: () => router.refresh() })
  const create = trpc.admin.groupement.create.useMutation(mutation)
  const update = trpc.admin.groupement.update.useMutation(mutation)
  const remove = trpc.admin.groupement.remove.useMutation({ onSuccess: () => router.refresh() })

  return (
    <ReferentialManager
      title="Groupements"
      description="Réseaux et groupements de pharmacies."
      itemLabel="groupement"
      items={items}
      onAdd={(name) => create.mutateAsync({ name }).then(() => undefined)}
      onRename={(id, name) => update.mutateAsync({ id, name }).then(() => undefined)}
      onDelete={(id) => remove.mutateAsync({ id }).then(() => undefined)}
    />
  )
}
