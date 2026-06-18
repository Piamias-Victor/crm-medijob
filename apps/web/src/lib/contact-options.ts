import type { ContactRole } from '@prisma/client'

export const ROLE_LABELS: Record<ContactRole, string> = {
  TITULAIRE: 'Titulaire',
  ADJOINT: 'Adjoint',
  PREPARATEUR_REFERENT: 'Préparateur référent',
  RESPONSABLE_RH: 'Responsable RH',
  AUTRE: 'Autre',
}
