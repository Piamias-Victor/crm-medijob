'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { ReferentialManager } from '@/components/organisms/ReferentialManager'
import type { RefItem } from '@/view-models/referential'

export function ContactRoleAdmin({ items }: { items: RefItem[] }) {
  const router = useRouter()
  const mutation = useEntityMutation({ onSuccess: () => router.refresh() })
  const create = trpc.admin.contactRole.create.useMutation(mutation)
  const update = trpc.admin.contactRole.update.useMutation(mutation)
  const remove = trpc.admin.contactRole.remove.useMutation({
    onSuccess: () => router.refresh(),
  })

  return (
    <ReferentialManager
      title="Rôles contact"
      description="Fonctions administrables des contacts en pharmacie."
      itemLabel="rôle"
      items={items}
      onAdd={(name) => create.mutateAsync({ name }).then(() => undefined)}
      onRename={(id, name) => update.mutateAsync({ id, name }).then(() => undefined)}
      onDelete={(id) => remove.mutateAsync({ id }).then(() => undefined)}
    />
  )
}
