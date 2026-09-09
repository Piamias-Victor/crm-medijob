export const AVAILABILITY_SMS_REMINDER_DAYS = 15

export function weeklyAvailabilitySmsContent(url: string): string {
  return `Bonne nouvelle, profil MEDIJOB validé. Consultez les missions dans l'app. Dispos : ${url}`
}

export function weeklyAvailabilityReminderSmsContent(url: string): string {
  return `MediJob : actualisez vos dispos pour recevoir des missions : ${url}`
}

export function availabilitySmsReminderCutoff(now: Date): Date {
  return new Date(now.getTime() - AVAILABILITY_SMS_REMINDER_DAYS * 24 * 60 * 60 * 1000)
}
