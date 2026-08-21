export type DevisContactRef = {
  firstName: string
  lastName: string
  email: string | null
}

export type DevisMissionRef = {
  id: string
  title: string
  pharmacyId: string
  pharmacyName: string
  contact: DevisContactRef | null
}
