// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { candidateExportFixture } from '@/server/routers/candidate-export.fixture'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'

function caller(deps = makeCandidateDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter exportCsv', () => {
  it('returns filtered CSV with selected columns and UTF-8 BOM', async () => {
    const listForExport = vi.fn().mockResolvedValue([candidateExportFixture])
    const result = await caller(makeCandidateDeps({ listForExport })).exportCsv({
      jobTitleIds: ['jt1'],
      columnIds: ['lastName', 'firstName', 'city'],
    })

    expect(listForExport).toHaveBeenCalledWith(
      { jobTitleIds: ['jt1'] },
      expect.arrayContaining(['lastName', 'firstName', 'city']),
    )
    expect(result.rowCount).toBe(1)
    expect(result.csv.charCodeAt(0)).toBe(0xfeff)
    expect(result.csv).toContain('Durand;Camille;Lyon')
  })

  it('forwards sort column to repository fetch ids', async () => {
    const listForExport = vi.fn().mockResolvedValue([candidateExportFixture])
    await caller(makeCandidateDeps({ listForExport })).exportCsv({
      columnIds: ['email'],
      sort: { columnId: 'city', direction: 'desc' },
    })

    expect(listForExport).toHaveBeenCalledWith(
      {},
      expect.arrayContaining(['firstName', 'lastName', 'email', 'city']),
    )
  })
})
