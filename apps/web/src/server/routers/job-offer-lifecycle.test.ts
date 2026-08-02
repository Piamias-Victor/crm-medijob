// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { caller, makeDeps, directionSession } from '@/server/routers/job-offer.test.fixtures'

describe('jobOfferRouter lifecycle', () => {
  it('publish sets PUBLIEE and publishedAt', async () => {
    const deps = makeDeps({
      getById: vi.fn().mockResolvedValue({
        id: 'o1',
        status: 'BROUILLON',
        title: 'Offre',
        content: 'x'.repeat(120),
      }),
    })
    await caller(deps).publish({ id: 'o1' })
    expect(deps.update).toHaveBeenCalledWith(
      'o1',
      expect.objectContaining({ status: 'PUBLIEE', publishedAt: expect.any(Date) }),
    )
  })

  it('unpublish sets DEPUBLIEE', async () => {
    const deps = makeDeps({
      getById: vi.fn().mockResolvedValue({
        id: 'o1',
        status: 'PUBLIEE',
        title: 'Offre',
        content: 'x'.repeat(120),
      }),
    })
    await caller(deps).unpublish({ id: 'o1' })
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
