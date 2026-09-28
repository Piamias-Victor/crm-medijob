import { z } from 'zod'
import { APP_CALL_OUTCOMES, APP_INTAKE_STATUSES } from './app-profile-intake.enums'
import { optionalReferentIdSchema } from './optional-referent-id.schema'

export const updateIntakeSchema = z
  .object({
    id: z.string().min(1),
    intakeStatus: z.enum(APP_INTAKE_STATUSES),
    callOutcome: z.enum(APP_CALL_OUTCOMES).nullable(),
    plannedRdvAt: z.coerce.date().nullable(),
    notes: z.string().trim().nullable(),
    referentId: optionalReferentIdSchema,
    relanceAt: z.coerce.date().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.callOutcome === 'RDV_PRIS' && !data.plannedRdvAt) {
      ctx.addIssue({
        code: 'custom',
        message: 'Date RDV requise pour RDV pris',
        path: ['plannedRdvAt'],
      })
    }
  })

export type UpdateIntakeInput = z.infer<typeof updateIntakeSchema>
