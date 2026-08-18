'use client'

import { Check, Pencil, Trash2, X } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { JobTitleTrameLinks } from '@/components/molecules/JobTitleTrameLinks'
import { useInlineEdit } from '@/lib/use-inline-edit'
import type { RefItem } from '@/view-models/referential'

type Props = {
  item: RefItem
  onRename: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => void
}

export function JobTitleCard({ item, onRename, onDelete }: Props) {
  const edit = useInlineEdit(item.name, (name) => onRename(item.id, name))

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-border/50 bg-white/90 p-4 shadow-sm transition-colors hover:border-accent/30">
      <div className="flex items-start justify-between gap-2">
        {edit.editing ? (
          <>
            <Input
              aria-label={`Renommer ${item.name}`}
              value={edit.value}
              onChange={(event) => edit.setValue(event.target.value)}
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
            <h3 className="min-w-0 truncate text-sm font-semibold text-fg">{item.name}</h3>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" className="px-2" aria-label="Renommer" onClick={() => edit.setEditing(true)}>
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" className="px-2" aria-label="Supprimer" onClick={() => onDelete(item.id)}>
                <Trash2 className="size-4 text-error" />
              </Button>
            </div>
          </>
        )}
      </div>
      <JobTitleTrameLinks profileKey={item.profileKey ?? null} />
    </li>
  )
}
