// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeFacturationRouter } from '@/server/routers/facturation'
import { makeMemoryFacturationDeps } from '@/server/routers/facturation-line.test.fixtures'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'
import type { UserRole } from '@/server/auth/permissions'
import type { FacturationDeps } from '@/server/routers/facturation'
import type { FinanceLineRecord } from '@/view-models/finance-line'

function withUnlinked(lines: FinanceLineRecord[]): FacturationDeps {
  const deps = makeMemoryFacturationDeps()
  return {
    ...deps,
    listLines: async (filters) => {
      const { listFinanceLines } = await import('@/lib/finance/list-finance-lines')
      return listFinanceLines(lines, filters)
    },
    linkLine: async (input) => {
      const line = lines.find((row) => row.id === input.id)
      if (!line) throw new Error('missing')
      const labelPharmacy = line.pharmacyLabel
      const labelCandidate = line.candidateLabel
      if (input.pharmacyId !== undefined) {
        line.pharmacyId = input.pharmacyId
        line.pharmacyName = 'Pharma Nord'
      }
      if (input.candidateId !== undefined) {
        line.candidateId = input.candidateId
        line.candidateName = 'Ada Lovelace'
      }
      line.pharmacyLabel = labelPharmacy
      line.candidateLabel = labelCandidate
      return line
    },
  }
}

function caller(deps: FacturationDeps, role: UserRole) {
  return createCallerFactory(makeFacturationRouter(deps))({
    session: { user: { id: 'u1', role }, expires: '2999-01-01' },
  })
}

describe('facturation linkLine', () => {
  it('links pharmacy and candidate while keeping Excel labels', async () => {
    const line = pilotageLine({
      id: 'excel-1',
      source: 'EXCEL_IMPORT',
      pharmacyId: null,
      pharmacyName: 'Excel Pharma',
      pharmacyLabel: 'Excel Pharma',
      candidateId: null,
      candidateName: 'Excel Candidat',
      candidateLabel: 'Excel Candidat',
    })
    const api = caller(withUnlinked([line]), 'DIRECTION')
    const updated = await api.linkLine({
      id: 'excel-1',
      pharmacyId: 'p1',
      candidateId: 'c1',
    })
    expect(updated).toMatchObject({
      pharmacyId: 'p1',
      candidateId: 'c1',
      pharmacyLabel: 'Excel Pharma',
      candidateLabel: 'Excel Candidat',
    })
  })

  it('forbids Recruteur from linking', async () => {
    await expect(
      caller(makeMemoryFacturationDeps(), 'RECRUTEUR').linkLine({
        id: 'line-1',
        pharmacyId: 'p1',
        candidateId: 'c1',
      }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})
