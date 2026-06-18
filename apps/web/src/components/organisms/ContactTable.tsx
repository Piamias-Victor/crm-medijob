'use client'

import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import type { ContactListRow } from '@/view-models/contact-list'
import { ROLE_LABELS } from '@/lib/contact-options'
import { Button } from '@/components/atoms/Button'

type Props = {
  rows: ContactListRow[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const HEADERS = ['Nom', 'Fonction', 'Pharmacie', 'Téléphone', 'Email', 'Ajouté le', '']

export function ContactTable({ rows, onEdit, onDelete }: Props) {
  const router = useRouter()

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-gradient-to-r from-accent-muted/50 via-white to-white text-left text-fg-muted">
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
            <tr
              key={row.id}
              className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-accent-muted/25"
              onClick={() => router.push(`/contacts/${row.id}`)}
            >
              <td className="px-4 py-3 font-medium text-fg">{row.fullName}</td>
              <td className="px-4 py-3 text-fg-muted">{ROLE_LABELS[row.role]}</td>
              <td className="px-4 py-3 text-fg-muted">{row.pharmacyName}</td>
              <td className="px-4 py-3 text-fg-muted">{row.phone ?? '—'}</td>
              <td className="px-4 py-3 text-fg-muted">{row.email ?? '—'}</td>
              <td className="px-4 py-3 text-fg-muted">{row.createdAtLabel}</td>
              <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" className="px-2" aria-label={`Modifier ${row.fullName}`} onClick={() => onEdit(row.id)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" className="px-2 text-error" aria-label={`Supprimer ${row.fullName}`} onClick={() => onDelete(row.id)}>
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
