import type { CandidateDetailTab } from '@/components/molecules/CandidateDetailTabs'

export const CANDIDATE_TAB_META: Record<
  CandidateDetailTab,
  { title: string; description: string }
> = {
  profil: {
    title: 'Profil candidat',
    description: 'Coordonnées, mobilité et préférences pour le matching.',
  },
  dispos: {
    title: 'Disponibilités',
    description: 'Planning mensuel déclaré par le candidat depuis son lien dispos.',
  },
  historique: {
    title: 'Historique',
    description: 'Timeline des interactions et notes liées au candidat.',
  },
  missions: {
    title: 'Missions actives',
    description: 'Suivi des missions en cours pour ce candidat.',
  },
  entretiens: {
    title: 'Entretiens',
    description: 'Historique des entretiens de qualification du candidat.',
  },
  documents: {
    title: 'Documents',
    description: 'CV, dossier anonymisé, export PDF et pièces jointes.',
  },
}
