import { z } from 'zod'

const authSecretSchema = z
  .object({
    AUTH_SECRET: z.string().min(1).optional(),
    NEXTAUTH_SECRET: z.string().min(1).optional(),
  })
  .refine((env) => env.AUTH_SECRET ?? env.NEXTAUTH_SECRET, {
    message: 'AUTH_SECRET or NEXTAUTH_SECRET is required in production',
  })

export function validateServerEnv() {
  if (process.env.NODE_ENV !== 'production') return
  authSecretSchema.parse(process.env)
}

export function getAuthSecret() {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
}
