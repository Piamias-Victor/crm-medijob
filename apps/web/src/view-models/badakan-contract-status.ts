const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  CREATED: 'Créé',
  VALIDATED: 'Validé',
  CANCELLED: 'Annulé',
}

export function badakanContractStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}
