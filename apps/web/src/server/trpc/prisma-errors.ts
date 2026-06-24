import { TRPCError } from '@trpc/server'
import { Prisma } from '@prisma/client'

function conflictFromPrisma(error: Prisma.PrismaClientKnownRequestError): TRPCError {
  return new TRPCError({
    code: 'CONFLICT',
    message: messageForUniqueTarget(error.meta?.target),
  })
}

function messageForUniqueTarget(target: unknown): string {
  const fields = Array.isArray(target) ? target.map(String) : []
  for (const field of fields) {
    const mapped = UNIQUE_MESSAGES[field]
    if (mapped) return mapped
  }
  return 'Cette valeur existe déjà.'
}

const UNIQUE_MESSAGES: Record<string, string> = {
  siret: 'Une pharmacie avec ce SIRET existe déjà.',
  email: 'Cet email est déjà utilisé.',
  name: 'Cette valeur existe déjà.',
}

function asUniqueViolation(error: unknown): Prisma.PrismaClientKnownRequestError | null {
  let current: unknown = error
  const seen = new Set<unknown>()
  while (current && !seen.has(current)) {
    seen.add(current)
    if (
      current instanceof Prisma.PrismaClientKnownRequestError &&
      current.code === 'P2002'
    ) {
      return current
    }
    if (current instanceof TRPCError) current = current.cause
    else if (current instanceof Error && 'cause' in current) current = current.cause
    else break
  }
  return null
}

export function mapPrismaError(error: unknown): TRPCError {
  const prisma = asUniqueViolation(error)
  if (prisma) return conflictFromPrisma(prisma)
  if (error instanceof TRPCError) return error
  throw error
}
