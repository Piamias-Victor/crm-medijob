'use client'

import { Check, Pencil, Trash2, X } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { useInlineEdit } from '@/lib/use-inline-edit'
import type { RefItem } from '@/view-models/referential'

type Props = {
  item: RefItem
  onRename: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => void
}

export function ReferentialRow({ item, onRename, onDelete }: Props) {
  const edit = useInlineEdit(item.name, (name) => onRename(item.id, name))

  if (edit.editing) {
    return (
      <li className="flex items-center gap-2 py-2">
        <Input
          aria-label={`Renommer ${item.name}`}
          value={edit.value}
          onChange={(e) => edit.setValue(e.target.value)}
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
    <li className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-surface/80">
      <span className="text-sm text-fg">{item.name}</span>
      <div className="flex gap-1">
        <Button variant="ghost" aria-label="Renommer" onClick={() => edit.setEditing(true)}>
          <Pencil className="size-4" />
        </Button>
        <Button variant="ghost" aria-label="Supprimer" onClick={() => onDelete(item.id)}>
          <Trash2 className="size-4 text-error" />
        </Button>
      </div>
    </li>
  )
}
