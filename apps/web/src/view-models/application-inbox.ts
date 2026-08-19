export type InboxItem = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  city: string | null
  cvUrl: string | null
  message: string | null
  createdAt: Date
  jobTitle: { name: string } | null
  jobOffer: { title: string }
}

export function formatInboxDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date)
}

export function inboxFullName(item: Pick<InboxItem, 'firstName' | 'lastName'>) {
  return `${item.firstName} ${item.lastName}`.trim()
}
