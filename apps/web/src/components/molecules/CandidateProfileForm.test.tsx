import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CandidateProfileForm } from '@/components/molecules/CandidateProfileForm'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'

vi.mock('@/lib/hooks/use-candidate-profile-mutations', () => ({
  useCandidateProfileMutations: () => ({
    update: { mutate: vi.fn(), isPending: false },
    createJobTitle: { mutateAsync: vi.fn() },
  }),
}))

const baseProfile: CandidateProfilePayload = {
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  email: null,
  phone: null,
  address: null,
  city: 'Lyon',
  postalCode: '69001',
  jobTitleId: 'jt1',
  jobTitleName: 'Pharmacien',
  mobilityRadiusKm: 30,
  mobilityNotes: null,
  availableFrom: null,
  notes: null,
  referentId: 'u1',
  referentName: 'Recruteur',
  cvUrl: null,
  cvSummary: null,
  anonymizedProfile: null,
  softwareIds: [],
  contractTypes: [],
  missions: [],
  formValues: {
    firstName: 'Camille',
    lastName: 'Durand',
    city: 'Lyon',
    postalCode: '69001',
    jobTitleId: 'jt1',
    referentId: 'u1',
    mobilityRadiusKm: 30,
    softwareIds: [],
    contractTypes: [],
  },
  isProfileIncompleteForMatching: false,
  missingMatchingFields: [],
}

const referentials = {
  jobTitles: [{ id: 'jt1', name: 'Pharmacien' }],
  softwares: [],
  recruiters: [{ id: 'u1', name: 'Recruteur' }],
}

describe('CandidateProfileForm', () => {
  it('resets visible fields when the server profile changes', () => {
    const { rerender } = render(
      <CandidateProfileForm candidateId="c1" profile={baseProfile} referentials={referentials} />,
    )
    expect(screen.getByLabelText('Nom')).toHaveValue('Durand')

    rerender(
      <CandidateProfileForm
        candidateId="c1"
        profile={{
          ...baseProfile,
          lastName: 'Martin',
          formValues: { ...baseProfile.formValues, lastName: 'Martin' },
        }}
        referentials={referentials}
      />,
    )

    expect(screen.getByLabelText('Nom')).toHaveValue('Martin')
  })
})
