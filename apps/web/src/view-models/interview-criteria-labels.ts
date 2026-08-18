export const INTERVIEW_CRITERIA_LABELS: Record<string, string> = {
  B1: 'Expérience en officine',
  B2: 'Autonomie & responsabilité',
  B3: 'Outils & périmètre technique',
  B4: 'Disponibilité',
  B5: 'Réactivité / dernière minute',
  B6: 'Mobilité',
  B7: 'Motivation',
  B8: 'Dossier documents',
  C1: 'Communication & clarté',
  C2: 'Professionnalisme & savoir-être',
  C3: 'Adaptabilité / intégration',
  C4: 'Fiabilité perçue',
  C5: 'Posture de service',
}

export function interviewCriterionLabel(id: string): string {
  return INTERVIEW_CRITERIA_LABELS[id] ?? id
}
