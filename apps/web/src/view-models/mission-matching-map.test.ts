// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { toMissionMatchingPayload } from '@/view-models/mission-matching-payload'
import type { CandidateMatchingRow } from '@/server/db/repositories/candidate-matching.select'
import type { PrefilterResult } from '@/server/matching/prefilter'

function row(id: string): CandidateMatchingRow {
  return {
    id,
    firstName: 'Camille',
    lastName: 'Durand',
    jobTitleId: 'jt1',
    city: 'Lyon',
    postalCode: '69003',
    mobilityRadiusKm: 30,
    availableFrom: null,
    jobTitle: { name: 'Pharmacien' },
    contractPreferences: [{ contractType: 'CDI' }],
  }
}

const candidateInput = {
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  jobTitleId: 'jt1',
  jobTitleName: 'Pharmacien',
  city: 'Lyon',
  postalCode: '69003',
  mobilityRadiusKm: 30,
  availableFrom: null,
  preferredContractTypes: ['CDI' as const],
}

describe('toMissionMatchingPayload', () => {
  it('ignore un score IA pour un id inconnu', () => {
    const payload = toMissionMatchingPayload(
      new Map([['c1', row('c1')]]),
      { eligible: [candidateInput], excluded: [] },
      [{ candidateId: 'unknown', score: 90, justification: 'ghost' }],
    )
    expect(payload.scored).toHaveLength(0)
  })

  it('ignore une exclusion sans row repository', () => {
    const payload = toMissionMatchingPayload(
      new Map(),
      {
        eligible: [],
        excluded: [{ candidateId: 'missing', candidate: candidateInput, reasons: ['geo'] }],
      },
      [],
    )
    expect(payload.excluded).toHaveLength(0)
  })

  it('ajoute éligibles non scorés dans excluded avec not_scored', () => {
    const eligible = [
      candidateInput,
      { ...candidateInput, id: 'c2', firstName: 'Paul', lastName: 'Bert' },
    ]
    const payload = toMissionMatchingPayload(
      new Map([
        ['c1', row('c1')],
        ['c2', row('c2')],
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
