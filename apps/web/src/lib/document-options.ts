import type { DocumentCategoryValue } from '@/view-models/document.types'
import { DOCUMENT_CATEGORIES } from '@/view-models/document.types'

export { DOCUMENT_CATEGORIES }

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategoryValue, string> = {
  CONTRAT: 'Contrat',
  DEVIS: 'Devis',
  FACTURE: 'Facture',
  CONVENTION: 'Convention',
  AUTRE: 'Autre',
}
