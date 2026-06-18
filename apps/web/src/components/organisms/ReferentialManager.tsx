'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'
import { ReferentialAddForm } from '@/components/molecules/ReferentialAddForm'
import { ReferentialRow } from '@/components/molecules/ReferentialRow'
import type { RefItem, ReferentialActions } from '@/view-models/referential'

type Props = ReferentialActions & {
  title: string
  description?: string
  items: RefItem[]
  itemLabel?: string
}

export function ReferentialManager({
  title,
  description,
  items,
  itemLabel,
  onAdd,
  onRename,
  onDelete,
}: Props) {
  const [pendingDelete, setPendingDelete] = useState<RefItem | null>(null)

  const confirmDelete = () => {
    if (!pendingDelete) return
    onDelete(pendingDelete.id)
    setPendingDelete(null)
  }

  return (
    <>
      <SectionCard
        variant="glass"
        title={title}
        description={description}
        bodyClassName="space-y-4 p-4 sm:p-5"
      >
        <ReferentialAddForm label={itemLabel ?? title} onAdd={onAdd} />
        {items.length === 0 ? (
          <p className="text-sm text-fg-muted">Aucun élément pour l’instant.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <ReferentialRow
                key={item.id}
                item={item}
                onRename={onRename}
                onDelete={(id) => {
                  const item = items.find((row) => row.id === id)
                  if (item) setPendingDelete(item)
                }}
              />
            ))}
          </ul>
        )}
      </SectionCard>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer cet élément ?"
        description={
          pendingDelete ? `« ${pendingDelete.name} » sera définitivement retiré du référentiel.` : ''
        }
      />
    </>
  )
}
