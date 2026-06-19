import type { MissionTab } from '@/view-models/mission-tabs'

export const MISSION_TAB_META: Record<MissionTab, { title: string; description: string }> = {
  infos: {
    title: 'Informations',
    description: 'Détails du besoin, rémunération et rattachements.',
  },
  pipeline: {
    title: 'Pipeline',
    description: 'Candidats positionnés sur cette mission.',
  },
  matching: {
    title: 'Matching IA',
    description: 'Scoring des candidats compatibles.',
  },
  offre: {
    title: 'Offre d’emploi',
    description: 'Génération et publication de l’offre.',
  },
  historique: {
    title: 'Historique',
    description: 'Activités enregistrées sur la mission.',
  },
  documents: {
    title: 'Documents',
    description: 'Contrats et pièces liés à la mission.',
  },
}
