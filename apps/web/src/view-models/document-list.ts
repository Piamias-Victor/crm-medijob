import type { DocumentEntityTypeValue } from '@/view-models/activity-log.types'
import type { DocumentCategoryValue } from '@/view-models/document.types'
import { formatBytes } from '@/lib/format-bytes'
import { DOCUMENT_CATEGORY_LABELS } from '@/lib/document-options'

export type DocumentRecord = {
  id: string
  entityType: DocumentEntityTypeValue
  category: DocumentCategoryValue
  name: string
  url: string
  size: number | null
  mimeType: string | null
  createdAt: Date
  pharmacyId: string | null
  contactId: string | null
  missionId: string | null
  candidateId: string | null
}

export type DocumentListRow = {
  id: string
  category: DocumentCategoryValue
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
