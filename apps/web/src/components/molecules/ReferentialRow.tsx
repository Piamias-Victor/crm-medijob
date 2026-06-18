'use client'

import { Check, Pencil, Trash2, X } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { useInlineEdit } from '@/lib/use-inline-edit'
import type { RefItem } from '@/view-models/referential'

const rowClass =
  'flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-white/90 px-3 py-2.5 shadow-sm transition-colors hover:border-accent/30'

type Props = {
  item: RefItem
  onRename: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => void
}

export function ReferentialRow({ item, onRename, onDelete }: Props) {
  const edit = useInlineEdit(item.name, (name) => onRename(item.id, name))

  if (edit.editing) {
    return (
      <li className={rowClass}>
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
      </li>
    )
  }

  return (
    <li className={rowClass}>
      <span className="truncate text-sm font-medium text-fg">{item.name}</span>
      <div className="flex shrink-0 gap-1">
        <Button variant="ghost" className="px-2" aria-label="Renommer" onClick={() => edit.setEditing(true)}>
          <Pencil className="size-4" />
        </Button>
        <Button variant="ghost" className="px-2" aria-label="Supprimer" onClick={() => onDelete(item.id)}>
          <Trash2 className="size-4 text-error" />
        </Button>
      </div>
    </li>
  )
}
