export type UserRecord = {
  id: string
  name: string
  email: string
  role: 'RECRUTEUR' | 'ADMIN'
  createdAt: Date
}
