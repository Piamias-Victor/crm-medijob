'use client'

import { AdminSectionCard } from '@/components/molecules/AdminSectionCard'
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
  return (
    <AdminSectionCard title={title} description={description}>
      <ReferentialAddForm label={itemLabel ?? title} onAdd={onAdd} />
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-fg-muted">Aucun élément pour l’instant.</p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-border">
          {items.map((item) => (
            <ReferentialRow
              key={item.id}
              item={item}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </AdminSectionCard>
  )
}
