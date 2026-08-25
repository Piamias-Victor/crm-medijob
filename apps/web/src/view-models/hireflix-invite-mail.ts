export const HIREFLIX_INVITE_SUBJECT = 'Votre entretien vidéo MediJob'

export function hireflixInviteHtml(firstName: string, url: string) {
  return `<p>Bonjour ${firstName},</p><p>Enregistrez votre entretien vidéo :</p><p><a href="${url}">${url}</a></p>`
}
