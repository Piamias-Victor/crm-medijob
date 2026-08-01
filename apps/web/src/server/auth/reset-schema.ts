import { z } from 'zod'
import { PASSWORD_MIN_LENGTH } from './constants'

export const requestPasswordResetSchema = z.object({
  email: z.string().trim().email('Email invalide'),
})

export const confirmPasswordResetSchema = z.object({
  token: z.string().min(1, 'Lien invalide'),
  password: z.string().min(PASSWORD_MIN_LENGTH, 'Au moins 8 caractères'),
})

export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>
export type ConfirmPasswordResetInput = z.infer<typeof confirmPasswordResetSchema>
