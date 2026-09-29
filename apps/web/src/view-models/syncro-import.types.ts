import type { AppCallOutcome, AppProfileStatus } from '@prisma/client'

export type SyncroSheetRow = {
  id: string
  prenom: string
  nom: string
  telephone?: string | null
  email?: string | null
  adresse?: string | null
  ville?: string | null
  cp?: string | number | null
  metier?: string | null
  profil?: string | null
  statut?: string | null
  resultat?: string | null
  notes?: string | null
  rdvLe?: string | Date | null
  relance?: string | Date | null
  dernierAppel?: string | Date | null
  attribueA?: string | null
  appelPar?: string | null
  valide?: string | null
}

export type SyncroImportMapped = {
  badakanId: string
  firstName: string
  lastName: string
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  activityLabel: string | null
  profileStatus: AppProfileStatus
  intakeStatus: string
  callOutcome: AppCallOutcome | null
  notes: string | null
  plannedRdvAt: Date | null
  relanceAt: Date | null
  lastCalledAt: Date | null
  referentName: string | null
  lastCalledByName: string | null
}
