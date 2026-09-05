import { z } from 'zod'

const namedSchema = z
  .object({
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    enterpriseName: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
  })
  .passthrough()

const fileRefSchema = z
  .union([
    z.string(),
    z.object({ url: z.string().optional().nullable() }).passthrough(),
  ])
  .optional()
  .nullable()

export const badakanContractSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    currentStep: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    pdfUrl: fileRefSchema,
    pdf: fileRefSchema,
    contractPdf: fileRefSchema,
    contractFile: fileRefSchema,
    dpaeUrl: fileRefSchema,
    dpae: fileRefSchema,
    dpaePdf: fileRefSchema,
    dpaeFile: fileRefSchema,
    recipient: namedSchema.optional().nullable(),
    enterprise: namedSchema.optional().nullable(),
  })
  .passthrough()

export type BadakanContractRaw = z.infer<typeof badakanContractSchema>
