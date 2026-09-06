export const RESET_EMAIL_SUBJECT = 'Réinitialisation de votre mot de passe MediJob'
export const INVITE_EMAIL_SUBJECT = 'Activez votre compte MediJob'

export function resetEmailHtml(resetUrl: string): string {
  return `<p>Pour choisir un nouveau mot de passe, ouvrez ce lien :</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
}

export function inviteEmailHtml(resetUrl: string): string {
  return `<p>Votre compte MediJob est prêt. Choisissez votre mot de passe :</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
}
