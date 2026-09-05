import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CandidateDetailTabs } from '@/components/molecules/CandidateDetailTabs'

describe('CandidateDetailTabs', () => {
  it('shows Dispos after Profil, then Entretiens between Missions and Documents', () => {
    render(
      <CandidateDetailTabs active="profil" onChange={() => undefined} missionCount={0} activityCount={0} />,
    )
    const tabs = screen.getAllByRole('tab').map((tab) => tab.textContent)
    expect(tabs).toEqual([
      'Profil',
      'Dispos',
      'Historique',
      'Missions',
      'Entretiens',
      'Documents',
    ])
  })
})
