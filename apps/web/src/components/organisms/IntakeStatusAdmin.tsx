'use client'

import { useEffect, useState } from 'react'
import { Reorder } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { SectionCard } from '@/components/molecules/SectionCard'
import { SoftDeleteModal } from '@/components/molecules/soft-delete-modal/soft-delete-modal'
import { IntakeStatusAddForm } from '@/components/molecules/IntakeStatusAddForm'
import { IntakeStatusAdminRow } from '@/components/molecules/IntakeStatusAdminRow'
import type { IntakeStatusAdminItem } from '@/view-models/intake-status-admin'

export function IntakeStatusAdmin({ items }: { items: IntakeStatusAdminItem[] }) {
  const router = useRouter()
  const [order, setOrder] = useState(items)
  const [pendingDelete, setPendingDelete] = useState<IntakeStatusAdminItem | null>(null)
  useEffect(() => setOrder(items), [items])

  const mutation = useEntityMutation({ onSuccess: () => router.refresh() })
  const create = trpc.admin.intakeStatus.create.useMutation(mutation)
  const update = trpc.admin.intakeStatus.update.useMutation(mutation)
  const remove = trpc.admin.intakeStatus.remove.useMutation({ onSuccess: () => router.refresh() })
  const reorder = trpc.admin.intakeStatus.reorder.useMutation(mutation)

  return (
    <>
      <SectionCard
        variant="glass"
        title="Statuts entrées app"
        description="Couleur appliquée sur la ligne Entrées app. Suppression si inutilisé, sinon archive."
        bodyClassName="space-y-4 p-4 sm:p-5"
      >
        <IntakeStatusAddForm
          onAdd={(input) => create.mutateAsync(input).then(() => undefined)}
        />
        <Reorder.Group axis="y" values={order} onReorder={setOrder} className="flex flex-col gap-2">
          {order.map((status) => (
            <IntakeStatusAdminRow
              key={status.id}
              item={status}
              onSave={(input) =>
                update.mutateAsync({ id: status.id, ...input }).then(() => undefined)
              }
              onDelete={() => setPendingDelete(status)}
              onDragEnd={() => reorder.mutate({ orderedIds: order.map((s) => s.id) })}
            />
          ))}
        </Reorder.Group>
      </SectionCard>
      <SoftDeleteModal
        entityName={pendingDelete?.name ?? ''}
        open={Boolean(pendingDelete)}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null)
        }}
        onConfirm={async () => {
          if (!pendingDelete) return
          await remove.mutateAsync({ id: pendingDelete.id })
        }}
      />
    </>
  )
}
