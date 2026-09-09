export const CONTRACT_SIGN_SMS_REMINDER_MS = 24 * 60 * 60 * 1000

export type SmsDueKind = 'first' | 'reminder'

export const badakanContractSignSmsContent =
  'Bonne nouvelle ! Vous etes validé(e) pour la mission. Contrat envoyé par e-mail via Badakan. Consultez-le et signez.'

export const badakanContractReminderSmsContent =
  "MediJob : votre contrat n'est pas encore signe. Consultez l'e-mail Badakan et signez."

export function contractSignSmsReminderCutoff(now: Date): Date {
  return new Date(now.getTime() - CONTRACT_SIGN_SMS_REMINDER_MS)
}
