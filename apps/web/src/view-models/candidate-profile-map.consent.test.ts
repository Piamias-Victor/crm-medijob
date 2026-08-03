import { describe, expect, it, vi } from 'vitest'
import { toCandidateCreateData } from '@/view-models/candidate-profile-map'

const base = {
  firstName: 'Alice',
  lastName: 'Martin',
  jobTitleId: 'jt1',
  status: 'NOUVEAU' as const,
  mobilityRadiusKm: 20,
  softwareIds: [] as string[],
  contractTypes: ['CDI'] as ('CDI' | 'CDD' | 'INTERIM')[],
}

describe('toCandidateCreateData consent', () => {
  it('sets MANUAL consent when consentGiven true', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-03T10:00:00.000Z'))
    const data = toCandidateCreateData({ ...base, consentGiven: true })
    expect(data.consentGivenAt).toEqual(new Date('2026-08-03T10:00:00.000Z'))
    expect(data.consentSource).toBe('MANUAL')
    vi.useRealTimers()
  })

  it('leaves consent null when not given', () => {
    const data = toCandidateCreateData({ ...base, consentGiven: false })
    expect(data.consentGivenAt).toBeNull()
    expect(data.consentSource).toBeNull()
  })
})
