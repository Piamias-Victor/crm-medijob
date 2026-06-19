import { TRPCError } from '@trpc/server'

export function entityNotFound(entityLabel: string): TRPCError {
  return new TRPCError({ code: 'NOT_FOUND', message: `${entityLabel} introuvable.` })
}

export function assertEntityFound<T>(entity: T | null | undefined, label: string): T {
  if (!entity) throw entityNotFound(label)
  return entity
}
