'use client'

import { useEffect, useState } from 'react'
import { Reorder } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { AdminSectionCard } from '@/components/molecules/AdminSectionCard'
import { ReferentialAddForm } from '@/components/molecules/ReferentialAddForm'
import { PipelineStageRow } from '@/components/molecules/PipelineStageRow'
import type { RefItem } from '@/view-models/referential'

export function PipelineAdmin({ items }: { items: RefItem[] }) {
  const router = useRouter()
  const [order, setOrder] = useState(items)
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
    <AdminSectionCard
      title="Étapes du pipeline"
      description="Glissez pour réordonner les colonnes kanban candidats et missions."
    >
      <ReferentialAddForm
        label="étape"
        onAdd={(name) => create.mutateAsync({ name }).then(() => undefined)}
      />
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={setOrder}
        className="mt-4 flex flex-col gap-2"
      >
        {order.map((stage) => (
          <PipelineStageRow
            key={stage.id}
            item={stage}
            onRename={(name) => update.mutateAsync({ id: stage.id, name }).then(() => undefined)}
            onDelete={() => remove.mutate({ id: stage.id })}
            onDragEnd={() => persistOrder(order)}
          />
        ))}
      </Reorder.Group>
    </AdminSectionCard>
  )
}
