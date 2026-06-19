import { z } from 'zod'
import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional()

const optionalInt = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number().int().min(0).optional(),
)

const optionalFloat = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number().min(0).optional(),
)

export const missionInputSchema = z.object({
  title: z.string().trim().min(1, 'Titre requis'),
  jobTitleId: z.string().min(1, 'Métier requis'),
  contractType: z.enum(CONTRACT_TYPES),
  pharmacyId: z.string().min(1, 'Pharmacie requise'),
  contactId: optionalText,
  referentId: z.string().min(1, 'Référent requis'),
  startDate: z.date({ message: 'Date de début requise' }),
  endDate: z.date().optional(),
  salaireMin: optionalInt,
  salaireMax: optionalInt,
  salaireNotes: optionalText,
  heuresParSemaine: optionalFloat,
  planning: optionalText,
  tempsPlein: z.boolean(),
  description: optionalText,
  notes: optionalText,
})

export type MissionInput = z.input<typeof missionInputSchema>
export type MissionFormValues = z.output<typeof missionInputSchema>

export const updateMissionSchema = z.object({
  id: z.string().min(1),
  data: missionInputSchema,
})

export const markPourvuSchema = z.object({
  id: z.string().min(1),
  placedCandidateId: z.string().min(1, 'Candidat placé requis'),
})

export const markAnnuleeSchema = z.object({ id: z.string().min(1) })
