import type { PharmacyTab } from '@/view-models/pharmacy-tabs'

export const PHARMACY_TAB_META: Record<PharmacyTab, { title: string; description: string }> = {
  infos: {
    title: 'Informations',
    description: 'Identité légale, coordonnées et référentiels de l’officine.',
  },
  contacts: {
    title: 'Contacts',
    description: 'Interlocuteurs rattachés à cette pharmacie.',
  },
  besoins: {
    title: 'Besoins en cours',
    description: 'Missions actives et création rapide d’un nouveau besoin.',
  },
  historique: {
    title: 'Historique',
    description: 'Activités et interactions enregistrées sur l’officine.',
  },
  documents: {
    title: 'Documents',
    description: 'Contrats, devis et conventions liés à la pharmacie.',
  },
}
