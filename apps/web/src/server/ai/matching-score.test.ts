// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { scoreMatchingCandidates } from '@/server/ai/matching-score'
import type { MatchingCandidateInput } from '@/server/matching/matching-input.types'

const mission = {
  title: 'Titulaire',
  jobTitleName: 'Pharmacien',
  pharmacyName: 'Pharma',
  pharmacyCity: 'Lyon',
  contractType: 'CDI' as const,
  startDate: new Date('2026-07-01'),
  description: null,
  jobTitleId: 'jt1',
  pharmacyPostalCode: '69001',
}

const candidate = (id: string): MatchingCandidateInput => ({
  id,
  firstName: 'Camille',
  lastName: 'Durand',
  jobTitleId: 'jt1',
  jobTitleName: 'Pharmacien',
  city: 'Lyon',
  postalCode: '69003',
  mobilityRadiusKm: 30,
  availableFrom: null,
  preferredContractTypes: ['CDI'],
})

describe('scoreMatchingCandidates', () => {
  it('retourne uniquement candidats scorés par IA (max 20)', async () => {
    const candidates = Array.from({ length: 25 }, (_, i) => candidate(`c${i + 1}`))
    const provider = {
      complete: vi.fn().mockResolvedValue(
        JSON.stringify({
          scores: candidates.slice(0, 20).map((c, index) => ({
            candidateId: c.id,
            score: 90 - index,
            justification: 'ok',
          })),
        }),
      ),
    }

    const scores = await scoreMatchingCandidates(mission, candidates, provider)
    expect(scores).toHaveLength(20)
    expect(scores.every((s) => candidates.slice(0, 20).some((c) => c.id === s.candidateId))).toBe(true)
  })
})
