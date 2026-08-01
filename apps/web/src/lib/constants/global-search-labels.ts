export const GLOBAL_SEARCH_GROUP_LABELS = {
  pharmacies: 'Pharmacies',
  contacts: 'Contacts',
  candidates: 'Candidats',
  missions: 'Missions',
} as const

export type GlobalSearchGroupKey = keyof typeof GLOBAL_SEARCH_GROUP_LABELS

export const GLOBAL_SEARCH_GROUP_ORDER: GlobalSearchGroupKey[] = [
  'pharmacies',
  'contacts',
  'candidates',
  'missions',
]
