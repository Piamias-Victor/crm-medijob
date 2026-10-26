const BOARD_METIER: Record<string, string> = {
  Préparateur: 'Préparateur en pharmacie',
  Pharmacien: 'Pharmacien adjoint',
  'Conseiller parapharmacie': 'Conseiller(ère) en parapharmacie',
}

export function boardMetierLabel(jobTitleName: string): string {
  return BOARD_METIER[jobTitleName] ?? jobTitleName
}
