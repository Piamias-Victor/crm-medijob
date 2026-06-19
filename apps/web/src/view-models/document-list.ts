import type { Document, DocumentCategory } from '@prisma/client'
import { formatBytes } from '@/lib/format-bytes'
import { DOCUMENT_CATEGORY_LABELS } from '@/lib/document-options'

export type DocumentRecord = Document

export type DocumentListRow = {
  id: string
  category: DocumentCategory
  categoryLabel: string
  name: string
  url: string
  size: number | null
  sizeLabel: string
  createdAt: Date
  dateLabel: string
}

export function toDocumentListRow(doc: DocumentRecord): DocumentListRow {
  const size = doc.size ?? 0
  return {
    id: doc.id,
    category: doc.category,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[doc.category],
    name: doc.name,
    url: doc.url,
    size: doc.size,
    sizeLabel: doc.size == null ? '—' : formatBytes(size),
    createdAt: doc.createdAt,
    dateLabel: doc.createdAt.toLocaleDateString('fr-FR'),
  }
}
