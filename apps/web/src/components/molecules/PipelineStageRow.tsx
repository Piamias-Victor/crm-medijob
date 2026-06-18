'use client'

import { Reorder } from 'framer-motion'
import { Check, GripVertical, Pencil, Trash2, X } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { useInlineEdit } from '@/lib/use-inline-edit'
import type { RefItem } from '@/view-models/referential'

const rowClass =
  'flex items-center gap-2 rounded-lg border border-border/50 bg-white/90 px-3 py-2.5 shadow-sm transition-colors hover:border-accent/30'

type Props = {
  item: RefItem
  onRename: (name: string) => Promise<void>
  onDelete: () => void
  onDragEnd: () => void
}

export function PipelineStageRow({ item, onRename, onDelete, onDragEnd }: Props) {
  const edit = useInlineEdit(item.name, onRename)

  return (
    <Reorder.Item value={item} onDragEnd={onDragEnd} className={rowClass}>
      <GripVertical className="size-4 shrink-0 cursor-grab text-fg-muted" aria-hidden />
      {edit.editing ? (
        <>
          <Input
            aria-label={`Renommer ${item.name}`}
            value={edit.value}
            onChange={(e) => edit.setValue(e.target.value)}
            className="h-10 flex-1 rounded-lg bg-white/80"
          />
          <Button variant="ghost" aria-label="Enregistrer" onClick={edit.save}>
            <Check className="size-4" />
          </Button>
          <Button variant="ghost" aria-label="Annuler" onClick={() => edit.setEditing(false)}>
            <X className="size-4" />
          </Button>
        </>
      ) : (
        <>
          <span className="flex-1 truncate text-sm font-medium text-fg">{item.name}</span>
          <Button variant="ghost" className="px-2" aria-label="Renommer" onClick={() => edit.setEditing(true)}>
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" className="px-2" aria-label="Supprimer" onClick={onDelete}>
            <Trash2 className="size-4 text-error" />
          </Button>
        </>
      )}
    </Reorder.Item>
  )
}
