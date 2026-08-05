import type { AnonymizedDossier } from '@/view-models/anonymized-dossier.schema'
import { ANONYMIZED_DOSSIER_KEYS } from '@/view-models/anonymized-dossier.schema'

export const ANONYMIZED_DOSSIER_LABELS: Record<keyof AnonymizedDossier, string> = {
  accroche: 'Accroche',
  metierExperience: 'Métier & expérience',
  competencesLogiciels: 'Compétences & logiciels',
  mobilite: 'Mobilité',
  disponibiliteContrat: 'Disponibilité & contrat',
  pointsForts: 'Points forts',
}

export function emptyAnonymizedDossier(): AnonymizedDossier {
  return {
    accroche: '',
    metierExperience: '',
    competencesLogiciels: '',
    mobilite: '',
    disponibiliteContrat: '',
    pointsForts: '',
  }
}

export { ANONYMIZED_DOSSIER_KEYS }
