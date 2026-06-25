export const CONTACT_PRIMARY_PROBE_ERROR = 'Impossible de vérifier le titulaire principal. Réessayez.'

export function formatContactPrimaryInfo(fullName: string): string {
  return `${fullName} est déjà titulaire principal pour cette pharmacie.`
}

export function formatContactPrimaryReplacementWarning(fullName: string): string {
  return `${fullName} est déjà titulaire principal pour cette pharmacie. En enregistrant, il sera remplacé.`
}

export function resolveContactPrimaryMessage(fullName: string, isPrimary: boolean): string {
  return isPrimary
    ? formatContactPrimaryReplacementWarning(fullName)
    : formatContactPrimaryInfo(fullName)
}

export function toContactPrimaryName(contact: { firstName: string; lastName: string }): string {
  return `${contact.firstName} ${contact.lastName}`.trim()
}
