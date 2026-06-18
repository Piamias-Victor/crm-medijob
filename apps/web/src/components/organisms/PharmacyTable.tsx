'use client'

import { Pencil, Trash2 } from 'lucide-react'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'
import { Button } from '@/components/atoms/Button'
import { PharmacyStatusBadge } from '@/components/molecules/PharmacyStatusBadge'

type Props = {
  rows: PharmacyListRow[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const HEADERS = ['Nom', 'Ville', 'Groupement', 'Statut', 'Contact principal', 'Missions', '']

export function PharmacyTable({ rows, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-surface text-left text-fg-muted">
          <tr>
            {HEADERS.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium text-fg">{row.name}</td>
              <td className="px-4 py-3 text-fg-muted">{row.city ?? '—'}</td>
              <td className="px-4 py-3 text-fg-muted">{row.groupementName ?? '—'}</td>
              <td className="px-4 py-3">
                <PharmacyStatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 text-fg-muted">{row.primaryContactName ?? '—'}</td>
              <td className="px-4 py-3 text-fg-muted">{row.missionCount}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" className="px-2" aria-label={`Modifier ${row.name}`} onClick={() => onEdit(row.id)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" className="px-2 text-error" aria-label={`Supprimer ${row.name}`} onClick={() => onDelete(row.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
