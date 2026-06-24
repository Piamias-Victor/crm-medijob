import { describe, it, expect } from 'vitest'
import { TRPCError } from '@trpc/server'
import { Prisma } from '@prisma/client'
import { mapPrismaError } from '@/server/trpc/prisma-errors'

function uniqueViolation(target: string[]) {
  return new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
    code: 'P2002',
    clientVersion: '0.0.0',
    meta: { target },
  })
}

describe('mapPrismaError', () => {
  it('maps duplicate pharmacy siret to a French conflict message', () => {
    const mapped = mapPrismaError(uniqueViolation(['siret']))
    expect(mapped).toBeInstanceOf(TRPCError)
    expect(mapped).toMatchObject({
      code: 'CONFLICT',
      message: 'Une pharmacie avec ce SIRET existe déjà.',
    })
  })

  it('maps duplicate pharmacy siret wrapped in a TRPC internal error', () => {
    const prisma = uniqueViolation(['siret'])
    const wrapped = new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: prisma.message,
      cause: prisma,
    })
    const mapped = mapPrismaError(wrapped)
    expect(mapped).toMatchObject({
      code: 'CONFLICT',
      message: 'Une pharmacie avec ce SIRET existe déjà.',
    })
  })

  it('passes through existing TRPC errors', () => {
    const original = new TRPCError({ code: 'NOT_FOUND', message: 'Introuvable' })
    expect(mapPrismaError(original)).toBe(original)
  })

  it('rethrows unknown errors', () => {
    const err = new Error('boom')
    expect(() => mapPrismaError(err)).toThrow(err)
  })
})
