import { TRPCError } from '@trpc/server'
import { IntakeError } from '@/server/application/intake-errors'
import { ApplicationAcceptError } from '@/server/application/accept'

export function mapApplicationError(error: unknown): never {
  if (error instanceof IntakeError) {
    if (error.code === 'NOT_FOUND') {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Application not found' })
    }
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Only pending applications can be refused',
    })
  }
  if (error instanceof ApplicationAcceptError) {
    throw new TRPCError({
      code: error.code === 'NOT_FOUND' ? 'NOT_FOUND' : 'BAD_REQUEST',
      message: error.code === 'NOT_FOUND' ? 'Application not found' : 'Application déjà traitée',
    })
  }
  throw error
}
