'use client'

import { useEffect, useState } from 'react'
import { Reorder } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'
import { ReferentialAddForm } from '@/components/molecules/ReferentialAddForm'
import { PipelineStageRow } from '@/components/molecules/PipelineStageRow'
import type { RefItem } from '@/view-models/referential'

export function PipelineAdmin({ items }: { items: RefItem[] }) {
  const router = useRouter()
  const [order, setOrder] = useState(items)
  const [pendingDelete, setPendingDelete] = useState<RefItem | null>(null)
  useEffect(() => setOrder(items), [items])

  const onSuccess = () => router.refresh()
  const onError = (e: { message: string }) => window.alert(e.message)
  const create = trpc.admin.pipeline.create.useMutation({ onSuccess })
  const update = trpc.admin.pipeline.update.useMutation({ onSuccess })
  const remove = trpc.admin.pipeline.remove.useMutation({ onSuccess, onError })
  const reorder = trpc.admin.pipeline.reorder.useMutation({ onSuccess })

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
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return
          remove.mutate({ id: pendingDelete.id })
          setPendingDelete(null)
        }}
        title="Supprimer cette étape ?"
        description={
          pendingDelete
            ? `« ${pendingDelete.name} » sera retirée du pipeline.`
            : ''
        }
        loading={remove.isPending}
      />
    </>
  )
}
