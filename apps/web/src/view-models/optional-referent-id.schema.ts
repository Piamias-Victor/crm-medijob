import { z } from 'zod'

/**
 * Optional Referent id for forms/API.
 * Empty string rejected — UI clears via `null`. Mappers coerce undefined → null.
 */
export const optionalReferentIdSchema = z.union([z.string().min(1), z.null()]).optional()

export type OptionalReferentId = string | null | undefined

export function toReferentIdOrNull(value: OptionalReferentId): string | null {
  return value ?? null
}
