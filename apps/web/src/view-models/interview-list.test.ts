import { describe, expect, it } from 'vitest'
import { toInterviewListRow } from '@/view-models/interview-list'

describe('toInterviewListRow', () => {
  it('maps draft interim interview to French labels', () => {
    const row = toInterviewListRow({
      id: 'i1',
      status: 'DRAFT',
      mode: 'INTERIM',
      decision: null,
      createdAt: new Date('2026-08-17T10:00:00Z'),
      candidateId: 'c1',
    })
    expect(row.statusLabel).toBe('Brouillon')
    expect(row.modeLabel).toBe('Intérim')
    expect(row.decisionLabel).toBeNull()
  })
})
