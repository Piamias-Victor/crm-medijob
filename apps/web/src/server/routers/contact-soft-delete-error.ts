import { TRPCError } from '@trpc/server'
import { PrimaryContactSoftDeleteError } from '@/server/db/repositories/contact-soft-delete'

export function mapContactSoftDeleteError(error: unknown): never {
  if (error instanceof PrimaryContactSoftDeleteError) {
    throw new TRPCError({ code: 'PRECONDITION_FAILED', message: error.message })
  }
  throw error
}
