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
