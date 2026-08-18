export const INTERVIEW_CHECKLIST_ITEMS = [
  { id: 'cv', label: 'CV' },
  { id: 'id_doc', label: 'Pièce d’identité' },
  { id: 'vitale', label: 'Carte Vitale' },
  { id: 'diploma', label: 'Diplôme' },
] as const

export type InterviewChecklistItemId = (typeof INTERVIEW_CHECKLIST_ITEMS)[number]['id']

export function toChecklistOptions(items: { id: string; label: string }[]) {
  return items.map((item) => ({ value: item.id, label: item.label }))
}
