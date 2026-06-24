// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { Prisma } from '@prisma/client'
import { createCallerFactory } from '@/server/trpc'
import { makePharmacyRouter } from '@/server/routers/pharmacy'

describe('prisma error middleware', () => {
  it('maps rejected prisma errors from async procedure promises', async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '0.0.0',
      meta: { target: ['siret'] },
    })
    const caller = createCallerFactory(
      makePharmacyRouter({
        pharmacies: {
          list: vi.fn(),
          findDetailById: vi.fn(),
          create: vi.fn().mockRejectedValue(prismaError),
          update: vi.fn(),
          softDelete: vi.fn(),
        },
        referentials: { listGroupements: vi.fn(), listSoftwares: vi.fn() },
        createGroupement: vi.fn(),
        createSoftware: vi.fn(),
        searchSiret: vi.fn(),
      }),
    )({
      session: { user: { id: 'u1', role: 'RECRUTEUR' }, expires: '2999-01-01' },
    })

    await expect(caller.create({ name: 'X', siret: '1' })).rejects.toMatchObject({
      code: 'CONFLICT',
      message: 'Une pharmacie avec ce SIRET existe déjà.',
    })
  })
})
