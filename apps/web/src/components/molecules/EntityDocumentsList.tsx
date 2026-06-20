'use client'

import { Download, FileText, Trash2 } from 'lucide-react'
import type { DocumentListRow } from '@/view-models/document-list'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { EmptyState } from '@/components/atoms/EmptyState'

type Props = {
  documents: DocumentListRow[]
  emptyLabel: string
  deletingId?: string
  onDownload: (id: string) => void
  onDelete: (id: string) => void
}

export function EntityDocumentsList({ documents, emptyLabel, deletingId, onDownload, onDelete }: Props) {
  if (documents.length === 0) {
    return <EmptyState icon={FileText} title={emptyLabel} variant="compact" />
  }

  return (
    <ul className="flex flex-col gap-2">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/55 bg-surface/90 px-4 py-3 text-sm shadow-sm"
        >
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-medium text-fg">{doc.name}</p>
              <Badge variant="accent">{doc.categoryLabel}</Badge>
            </div>
            <p className="text-xs text-fg-muted">
              {doc.sizeLabel} · {doc.dateLabel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => onDownload(doc.id)}>
              <Download className="size-4" />
              Télécharger
            </Button>
            <Button
              variant="ghost"
              disabled={deletingId === doc.id}
              onClick={() => onDelete(doc.id)}
              aria-label={`Supprimer ${doc.name}`}
            >
              <Trash2 className="size-4 text-error" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
