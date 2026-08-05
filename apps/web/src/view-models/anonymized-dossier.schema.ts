import { z } from 'zod'

const section = (max: number) => z.string().max(max)

export const anonymizedDossierSchema = z
  .object({
    accroche: section(500),
    metierExperience: section(1500),
    competencesLogiciels: section(1500),
    mobilite: section(1500),
    disponibiliteContrat: section(1500),
    pointsForts: section(1500),
  })
  .strict()

export type AnonymizedDossier = z.infer<typeof anonymizedDossierSchema>

export const ANONYMIZED_DOSSIER_KEYS = [
  'accroche',
  'metierExperience',
  'competencesLogiciels',
  'mobilite',
  'disponibiliteContrat',
  'pointsForts',
] as const satisfies ReadonlyArray<keyof AnonymizedDossier>
