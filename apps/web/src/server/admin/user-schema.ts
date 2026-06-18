import { z } from 'zod'
import { USER_ROLES } from '@/view-models/user-admin'

export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Nom requis'),
  email: z.string().trim().email('Email invalide'),
  password: z.string().min(8, 'Au moins 8 caractères'),
  role: z.enum(USER_ROLES),
})

export const updateUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, 'Nom requis'),
  role: z.enum(USER_ROLES),
  password: z.union([z.string().min(8, 'Au moins 8 caractères'), z.literal('')]).optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

export function normalizeUpdatePassword(password?: string): string | undefined {
  const trimmed = password?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}
