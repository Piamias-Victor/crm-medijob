export type InvitationLabelInput = {
  email: string | null
  inviteEmailSentAt: Date | null
  inviteLastError: string | null
}

export function appProfileInvitationLabel(row: InvitationLabelInput) {
  if (row.inviteEmailSentAt) return 'Envoyée'
  if (!row.email) return 'En attente d’email'
  if (row.inviteLastError) return 'Échec'
  return 'À envoyer'
}
