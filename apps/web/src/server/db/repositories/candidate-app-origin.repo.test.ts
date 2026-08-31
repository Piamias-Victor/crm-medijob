import { describe, expect, it, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { makeCandidateAppOriginRepository } from './candidate-app-origin.repo'

describe('candidate app origin repository', () => {
  it('creates origin App at status Nouveau', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'c1' })
    const repo = makeCandidateAppOriginRepository({
      candidate: { create },
    } as unknown as PrismaClient)
    await repo.createAppCandidate({
      firstName: 'Marie',
      lastName: 'App',
      email: 'marie@app.fr',
      phone: '0600000001',
      address: null,
      city: null,
      postalCode: null,
      jobTitleId: 'jt1',
      origin: 'APP',
      status: 'NOUVEAU',
      badakanId: 'bk-marie',
    })
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          origin: 'APP',
          status: 'NOUVEAU',
          badakanId: 'bk-marie',
        }),
      }),
    )
  })

  it('links origin App without changing status', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'c1', status: 'QUALIFIE' })
    const repo = makeCandidateAppOriginRepository({
      candidate: { update },
    } as unknown as PrismaClient)
    await repo.linkAppOrigin('c1', 'bk-marie')
    expect(update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { origin: 'APP', badakanId: 'bk-marie' },
      select: { id: true },
    })
    expect(update.mock.calls[0]?.[0].data).not.toHaveProperty('status')
  })

  it('patches identity without interview fields', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'c1' })
    const repo = makeCandidateAppOriginRepository({
      candidate: { update },
    } as unknown as PrismaClient)
    await repo.patchAppIdentity('c1', { address: '12 rue Test', city: 'Lyon' })
    expect(update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { address: '12 rue Test', city: 'Lyon' },
      select: { id: true },
    })
    expect(update.mock.calls[0]?.[0].data).not.toHaveProperty('notes')
    expect(update.mock.calls[0]?.[0].data).not.toHaveProperty('availableFrom')
    expect(update.mock.calls[0]?.[0].data).not.toHaveProperty('salaryExpectations')
  })
})
