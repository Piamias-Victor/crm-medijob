export type InboxItem = {
  id: string
  firstName: string
  lastName: string
  email: string
  city: string | null
  createdAt: Date
  jobTitle: { name: string } | null
  jobOffer: { title: string }
}

export function formatInboxDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date)
}
