export const RESET_EMAIL_SUBJECT = 'Réinitialisation de votre mot de passe MediJob'

export function resetEmailHtml(resetUrl: string): string {
  return `<p>Pour choisir un nouveau mot de passe, ouvrez ce lien :</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
}
