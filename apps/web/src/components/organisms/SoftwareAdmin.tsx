'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { ReferentialManager } from '@/components/organisms/ReferentialManager'
import type { RefItem } from '@/view-models/referential'

export function SoftwareAdmin({ items }: { items: RefItem[] }) {
  const router = useRouter()
  const mutation = useEntityMutation({ onSuccess: () => router.refresh() })
  const create = trpc.admin.software.create.useMutation(mutation)
  const update = trpc.admin.software.update.useMutation(mutation)
  const remove = trpc.admin.software.remove.useMutation({ onSuccess: () => router.refresh() })

  return (
    <ReferentialManager
      title="Logiciels"
      description="LGO et logiciels pharmacie pour candidats et officines."
      itemLabel="logiciel"
      items={items}
      onAdd={(name) => create.mutateAsync({ name }).then(() => undefined)}
      onRename={(id, name) => update.mutateAsync({ id, name }).then(() => undefined)}
      onDelete={(id) => remove.mutateAsync({ id }).then(() => undefined)}
    />
  )
}
