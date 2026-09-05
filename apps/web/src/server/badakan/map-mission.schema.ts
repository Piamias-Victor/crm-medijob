import { z } from 'zod'

const identifier = z.union([z.string(), z.number()]).transform(String)

// Badakan serialises dates as epoch milliseconds on missions, as ISO strings elsewhere.
const badakanDate = z
  .union([z.string(), z.number()])
  .nullish()
  .transform((value) =>
    typeof value === 'number' ? new Date(value).toISOString() : (value ?? null),
  )

// A mission keys its applicants by recipientId; other endpoints use id.
const recipientSchema = z
  .object({
    id: identifier.optional(),
    recipientId: identifier.optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional().nullable(),
    mobilePhone: z.string().optional().nullable(),
    validatedPhoneNumber: z.string().optional().nullable(),
    currentStep: z.string().optional().nullable(),
  })
  .passthrough()

const periodSchema = z
  .object({
    startDate: badakanDate,
    endDate: badakanDate,
    beginDate: badakanDate,
  })
  .passthrough()

// Badakan geolocates the officine as GeoJSON: [longitude, latitude].
const addressSchema = z
  .object({
    address1: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    location: z
      .object({ coordinates: z.array(z.number()).optional().nullable() })
      .passthrough()
      .optional()
      .nullable(),
  })
  .passthrough()

const enterpriseSchema = z
  .object({
    id: identifier.optional(),
    enterpriseName: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    address: addressSchema.optional().nullable(),
  })
  .passthrough()

export const badakanMissionSchema = z
  .object({
    id: identifier,
    identifier: z.string().optional().nullable(),
    currentStep: z.string().optional().nullable(),
    expectedStartDate: badakanDate,
    expectedEndDate: badakanDate,
    enterprise: enterpriseSchema.optional().nullable(),
    activity: z
      .object({ id: identifier.optional(), label: z.string().optional().nullable() })
      .passthrough()
      .optional()
      .nullable(),
    grade: z.object({ hourlyRate: z.number().optional().nullable() }).passthrough().optional().nullable(),
    contact: z
      .object({
        firstName: z.string().optional().nullable(),
        lastName: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
      })
      .passthrough()
      .optional()
      .nullable(),
    instruction: z.string().optional().nullable(),
    reason: z.string().optional().nullable(),
    hourlyRateWithoutTaxes: z.number().optional().nullable(),
    expectedNumberOfRecipients: z.number().optional().nullable(),
    staffedNumberOfRecipients: z.number().optional().nullable(),
    periods: z.array(periodSchema).optional().nullable(),
    recipients: z.array(recipientSchema).optional().nullable(),
  })
  .passthrough()

export type BadakanMissionRaw = z.infer<typeof badakanMissionSchema>
export type BadakanPeriodRaw = z.infer<typeof periodSchema>
