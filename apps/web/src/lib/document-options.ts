import type { DocumentCategory } from '@prisma/client'

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  CONTRAT: 'Contrat',
  DEVIS: 'Devis',
  FACTURE: 'Facture',
  CONVENTION: 'Convention',
  AUTRE: 'Autre',
}

export const DOCUMENT_CATEGORIES = Object.keys(DOCUMENT_CATEGORY_LABELS) as DocumentCategory[]
