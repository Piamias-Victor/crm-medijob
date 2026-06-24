import { z } from 'zod'

export function isValidEmailRecipient(value: string): boolean {
  return z.string().email().safeParse(value.trim()).success
}
