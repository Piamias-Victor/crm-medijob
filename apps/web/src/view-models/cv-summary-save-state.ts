export function cvSummarySaveButtonLabel(input: {
  dirty: boolean
  saving: boolean
  hasValue: boolean
}): string {
  if (input.saving) return 'Enregistrement…'
  if (!input.hasValue) return 'Enregistrer'
  if (!input.dirty) return 'Enregistré'
  return 'Enregistrer'
}

export function isCvSummarySaveDisabled(input: {
  dirty: boolean
  saving: boolean
  hasValue: boolean
}): boolean {
  return !input.dirty || !input.hasValue || input.saving
}
