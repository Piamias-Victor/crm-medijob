'use client'

import { useEffect, useState } from 'react'
import { Reorder } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { SectionCard } from '@/components/molecules/SectionCard'
import { SoftDeleteModal } from '@/components/molecules/soft-delete-modal/soft-delete-modal'
import { ReferentialAddForm } from '@/components/molecules/ReferentialAddForm'
import { PipelineStageRow } from '@/components/molecules/PipelineStageRow'
import type { RefItem } from '@/view-models/referential'

export function PipelineAdmin({ items }: { items: RefItem[] }) {
  const router = useRouter()
  const [order, setOrder] = useState(items)
  const [pendingDelete, setPendingDelete] = useState<RefItem | null>(null)
  useEffect(() => setOrder(items), [items])

  const mutation = useEntityMutation({ onSuccess: () => router.refresh() })
  const create = trpc.admin.pipeline.create.useMutation(mutation)
  const update = trpc.admin.pipeline.update.useMutation(mutation)
  const remove = trpc.admin.pipeline.remove.useMutation({ onSuccess: () => router.refresh() })
  const reorder = trpc.admin.pipeline.reorder.useMutation(mutation)

  const persistOrder = (next: RefItem[]) =>
    reorder.mutate({ orderedIds: next.map((s) => s.id) })

  return (
    <>
      <SectionCard
        variant="glass"
        title="Étapes du pipeline"
        description="Glissez pour réordonner les colonnes kanban candidats et missions."
        bodyClassName="space-y-4 p-4 sm:p-5"
      >
        <ReferentialAddForm label="étape" onAdd={(name) => create.mutateAsync({ name }).then(() => undefined)} />
        <Reorder.Group
          axis="y"
          values={order}
          onReorder={setOrder}
          className="flex flex-col gap-2"
        >
          {order.map((stage) => (
            <PipelineStageRow
              key={stage.id}
              item={stage}
              onRename={(name) => update.mutateAsync({ id: stage.id, name }).then(() => undefined)}
              onDelete={() => setPendingDelete(stage)}
              onDragEnd={() => persistOrder(order)}
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
