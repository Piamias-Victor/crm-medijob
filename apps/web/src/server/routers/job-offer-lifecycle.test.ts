// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { caller, makeDeps, directionSession } from '@/server/routers/job-offer.test.fixtures'

describe('jobOfferRouter lifecycle', () => {
  it('publish upserts board listing then stores id as PUBLIEE', async () => {
    const upsert = vi.fn().mockResolvedValue({ id: 'board-uuid' })
    const deps = makeDeps({
      getById: vi.fn().mockResolvedValue({
        id: 'o1',
        missionId: 'm1',
        status: 'BROUILLON',
        title: 'Offre',
        content: 'x'.repeat(120),
        boardListingId: null,
      }),
      board: { upsert, setPubliee: vi.fn() },
    })
    await caller(deps).publish({ id: 'o1' })
    expect(upsert).toHaveBeenCalled()
    expect(deps.update).toHaveBeenCalledWith(
      'o1',
      expect.objectContaining({
        status: 'PUBLIEE',
        boardListingId: 'board-uuid',
        publishedAt: expect.any(Date),
      }),
    )
  })

  it('leaves CRM unpublished when board upsert fails', async () => {
    const deps = makeDeps({
      getById: vi.fn().mockResolvedValue({
        id: 'o1',
        missionId: 'm1',
        status: 'BROUILLON',
        title: 'Offre',
        content: 'x'.repeat(120),
        boardListingId: null,
      }),
      board: {
        upsert: vi.fn().mockRejectedValue(new Error('board down')),
        setPubliee: vi.fn(),
      },
    })
    await expect(caller(deps).publish({ id: 'o1' })).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Impossible de publier sur le site. Réessayez.',
    })
    expect(deps.update).not.toHaveBeenCalled()
  })

  it('unpublish hides listing without deleting', async () => {
    const setPubliee = vi.fn()
    const upsert = vi.fn()
    const deps = makeDeps({
      getById: vi.fn().mockResolvedValue({
        id: 'o1',
        missionId: 'm1',
        status: 'PUBLIEE',
        title: 'Offre',
        content: 'x'.repeat(120),
        boardListingId: 'board-uuid',
      }),
      board: { upsert, setPubliee },
    })
    await caller(deps).unpublish({ id: 'o1' })
    expect(setPubliee).toHaveBeenCalledWith('board-uuid', false)
    expect(upsert).not.toHaveBeenCalled()
    expect(deps.update).toHaveBeenCalledWith('o1', expect.objectContaining({ status: 'DEPUBLIEE' }))
  })

  it('soft deletes for Direction', async () => {
    const deps = makeDeps()
    await caller(deps, directionSession).softDelete({ id: 'o1' })
    expect(deps.softDelete).toHaveBeenCalledWith('o1')
  })

  it('forbids soft delete for Recruteur', async () => {
    const deps = makeDeps()
    await expect(caller(deps).softDelete({ id: 'o1' })).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})
