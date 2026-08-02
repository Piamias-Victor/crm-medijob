// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { caller, makeDeps } from '@/server/routers/job-offer.test.fixtures'

describe('jobOfferRouter', () => {
  it('returns mapped list rows', async () => {
    const deps = makeDeps({
      list: vi.fn().mockResolvedValue([
        {
          id: 'o1',
          title: 'Pharmacien',
          status: 'BROUILLON',
          publishedAt: null,
          mission: { id: 'm1', title: 'Mission CDI' },
          _count: { applications: 2 },
        },
      ]),
    })
    const rows = await caller(deps).list()
    expect(rows[0]?.missionTitle).toBe('Mission CDI')
    expect(rows[0]?.applicationCount).toBe(2)
  })

  it('generate creates brouillon from mission via IA Zod', async () => {
    const deps = makeDeps()
    const offer = await caller(deps).generate({ missionId: 'm1' })
    expect(offer.status).toBe('BROUILLON')
    expect(offer.title.length).toBeGreaterThan(0)
    expect(offer.content.length).toBeGreaterThanOrEqual(100)
    expect(deps.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.any(String),
        content: expect.any(String),
        mission: { connect: { id: 'm1' } },
      }),
    )
  })

  it('generate updates existing brouillon instead of creating a second offer', async () => {
    const deps = makeDeps({
      findByMissionId: vi.fn().mockResolvedValue({
        id: 'o1',
        status: 'BROUILLON',
        title: 'Ancien',
        content: 'x'.repeat(120),
      }),
    })
    await caller(deps).generate({ missionId: 'm1' })
    expect(deps.create).not.toHaveBeenCalled()
    expect(deps.update).toHaveBeenCalledWith(
      'o1',
      expect.objectContaining({ status: 'BROUILLON', title: expect.any(String) }),
    )
  })

  it('generate rejects when offer is already published', async () => {
    const deps = makeDeps({
      findByMissionId: vi.fn().mockResolvedValue({
        id: 'o1',
        status: 'PUBLIEE',
        title: 'Live',
        content: 'x'.repeat(120),
      }),
    })
    await expect(caller(deps).generate({ missionId: 'm1' })).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    })
  })
})
