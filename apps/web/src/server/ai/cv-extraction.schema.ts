import { z } from 'zod'
import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'
import { normalizeCvExtractionJson } from '@/server/ai/cv-extraction-normalize'

const cvFields = {
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  jobTitle: z.string().optional(),
  softwares: z.array(z.string()).optional(),
  preferredContractTypes: z.array(z.enum(CONTRACT_TYPES)).optional(),
  availableFrom: z.string().datetime().optional(),
  mobilityNotes: z.string().optional(),
  profileSummary: z.string().optional(),
}

export const cvExtractionAiSchema = z.object({
  ...cvFields,
  rawText: z.string().optional(),
})

export const cvExtractionSchema = z.object(cvFields)

export type CvExtractionAi = z.infer<typeof cvExtractionAiSchema>
export type CvExtraction = z.infer<typeof cvExtractionSchema>

export function parseCvExtraction(raw: string): CvExtractionAi {
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    throw new Error('AI_RESPONSE_NOT_JSON')
  }
  return cvExtractionAiSchema.parse(normalizeCvExtractionJson(json))
}
