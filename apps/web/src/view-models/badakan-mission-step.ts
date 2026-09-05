const STEP_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  CREATED: 'Créée',
  STAFFED: 'Staffée',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
}

export function badakanMissionStepLabel(step: string): string {
  return STEP_LABELS[step] ?? step
}
