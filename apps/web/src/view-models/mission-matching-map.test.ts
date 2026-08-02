// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { toMatchingCandidateInput } from '@/view-models/mission-matching-map'
import { toMissionMatchingPayload } from '@/view-models/mission-matching-payload'
import {
  matchingCandidateInput,
  matchingRow,
} from '@/view-models/mission-matching-map.test.fixtures'

describe('toMatchingCandidateInput', () => {
  it('expose prétentions salariales pour le scoring', () => {
    expect(toMatchingCandidateInput(matchingRow('c1'))).toMatchObject({
      salaryExpectations: '45k',
      salaryMin: 40000,
      salaryMax: 50000,
    })
  })
})

describe('toMissionMatchingPayload', () => {
  it('expose email, téléphone et prétentions sur le classement', () => {
    const payload = toMissionMatchingPayload(
      new Map([['c1', matchingRow('c1')]]),
      { eligible: [matchingCandidateInput], excluded: [] },
      [{ candidateId: 'c1', score: 88, justification: 'ok' }],
    )
    expect(payload.scored[0]).toMatchObject({
      email: 'camille@example.com',
      phone: '0612345678',
      salaryLabel: '45k',
    })
  })

  it('ignore un score IA pour un id inconnu', () => {
    const payload = toMissionMatchingPayload(
      new Map([['c1', matchingRow('c1')]]),
      { eligible: [matchingCandidateInput], excluded: [] },
      [{ candidateId: 'unknown', score: 90, justification: 'ghost' }],
    )
    expect(payload.scored).toHaveLength(0)
  })

  it('ignore une exclusion sans row repository', () => {
    const payload = toMissionMatchingPayload(
      new Map(),
      {
        eligible: [],
        excluded: [
          {
            candidateId: 'missing',
            candidate: matchingCandidateInput,
            reasons: ['geo'],
          },
        ],
      },
      [],
    )
    expect(payload.excluded).toHaveLength(0)
  })

  it('ajoute éligibles non scorés dans excluded avec not_scored', () => {
    const eligible = [
      matchingCandidateInput,
      { ...matchingCandidateInput, id: 'c2', firstName: 'Paul', lastName: 'Bert' },
    ]
    const payload = toMissionMatchingPayload(
      new Map([
        ['c1', matchingRow('c1')],
        ['c2', matchingRow('c2')],
      ]),
      { eligible, excluded: [] },
      [{ candidateId: 'c1', score: 80, justification: 'ok' }],
    )
    expect(payload.scored).toHaveLength(1)
    expect(payload.excluded).toHaveLength(1)
    expect(payload.excluded[0]).toMatchObject({ candidateId: 'c2' })
    expect(payload.excluded[0]?.reasons[0]?.code).toBe('not_scored')
  })
})
