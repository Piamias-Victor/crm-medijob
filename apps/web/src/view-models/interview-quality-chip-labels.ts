const QUALITY_SHORT: Record<string, string> = {
  'Réponse floue / évasive': 'Flou',
  'Réponse correcte, générique': 'Générique',
  'Réponse solide, structurée': 'Solide',
  'Réponse remarquable, exemples concrets': 'Remarquable',
}

export function interviewChipDisplayLabel(label: string): string {
  return QUALITY_SHORT[label] ?? label
}
