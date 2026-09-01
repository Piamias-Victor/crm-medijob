import { z } from 'zod'

const userSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    mobilePhone: z.string().optional().nullable(),
    validatedPhoneNumber: z.string().optional().nullable(),
    principal: z.boolean().optional(),
    isPrincipal: z.boolean().optional(),
  })
  .passthrough()

const addressSchema = z
  .object({
    address1: z.string().optional().nullable(),
    address2: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
  })
  .passthrough()

export const badakanEnterpriseSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    enterpriseName: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    siret: z.string().optional().nullable(),
    siretNumber: z.string().optional().nullable(),
    address: z.union([z.string(), addressSchema]).optional().nullable(),
    city: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    users: z.array(userSchema).optional().nullable(),
    principalUser: userSchema.optional().nullable(),
  })
  .passthrough()

export type BadakanEnterpriseRaw = z.infer<typeof badakanEnterpriseSchema>
export type BadakanEnterpriseUser = z.infer<typeof userSchema>
