import type { ContactTab } from '@/components/molecules/ContactTabs'

export const CONTACT_TAB_META: Record<ContactTab, { title: string; description: string }> = {
  infos: {
    title: 'Coordonnées',
    description: 'Modifiez directement les champs puis enregistrez.',
  },
  historique: {
    title: 'Historique',
    description: 'Interactions et activités enregistrées sur ce contact.',
  },
  missions: {
    title: 'Missions liées',
    description: 'Besoins où ce contact est l’interlocuteur.',
  },
  documents: {
    title: 'Documents',
    description: 'Fichiers rattachés à ce contact.',
  },
}
