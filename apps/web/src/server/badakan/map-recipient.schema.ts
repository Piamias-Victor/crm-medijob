import { z } from 'zod'

const activityItem = z.union([
  z.string(),
  z.object({ label: z.string().optional(), name: z.string().optional() }),
])

const docFile = z
  .object({
    rectoUrl: z.string().optional(),
    versoUrl: z.string().optional(),
    rectoFormat: z.string().optional(),
    versoFormat: z.string().optional(),
  })
  .passthrough()

export const badakanRecipientSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    mobilePhone: z.string().optional().nullable(),
    validatedPhoneNumber: z.string().optional().nullable(),
    address: z
      .object({
        address1: z.string().optional().nullable(),
        address2: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
        zipCode: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
    city: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    activity: activityItem.optional().nullable(),
    activities: z.array(activityItem).optional().nullable(),
    healthCareNumber: z.string().optional().nullable(),
    bankAccount: z
      .object({ iban: z.string().optional().nullable() })
      .passthrough()
      .optional()
      .nullable(),
    documents: z
      .object({
        RESUME: docFile.optional(),
        NATIONAL_ID_CARD: docFile.optional(),
        DIPLOMA: docFile.optional(),
        RIB: docFile.optional(),
      })
      .passthrough()
      .optional()
      .nullable(),
  })
  .passthrough()

export type BadakanRecipientRaw = z.infer<typeof badakanRecipientSchema>
export type ActivityItem = z.infer<typeof activityItem>
