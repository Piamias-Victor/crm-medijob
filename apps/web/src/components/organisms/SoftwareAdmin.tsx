'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { ReferentialManager } from '@/components/organisms/ReferentialManager'
import type { RefItem } from '@/view-models/referential'

export function SoftwareAdmin({ items }: { items: RefItem[] }) {
  const router = useRouter()
  const onSuccess = () => router.refresh()
  const onError = (e: { message: string }) => window.alert(e.message)
  const create = trpc.admin.software.create.useMutation({ onSuccess })
  const update = trpc.admin.software.update.useMutation({ onSuccess })
  const remove = trpc.admin.software.remove.useMutation({ onSuccess, onError })

  return (
    <ReferentialManager
      title="Logiciels"
      description="LGO et logiciels pharmacie pour candidats et officines."
      itemLabel="logiciel"
      items={items}
      onAdd={(name) => create.mutateAsync({ name }).then(() => undefined)}
      onRename={(id, name) => update.mutateAsync({ id, name }).then(() => undefined)}
      onDelete={(id) => remove.mutate({ id })}
    />
  )
}
