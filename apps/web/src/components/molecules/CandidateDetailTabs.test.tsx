import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CandidateDetailTabs } from '@/components/molecules/CandidateDetailTabs'

describe('CandidateDetailTabs', () => {
  it('shows Entretiens after Missions and before Documents', () => {
    render(
      <CandidateDetailTabs active="profil" onChange={() => undefined} missionCount={0} activityCount={0} />,
    )
    const tabs = screen.getAllByRole('tab').map((tab) => tab.textContent)
    expect(tabs).toEqual(['Profil', 'Historique', 'Missions', 'Entretiens', 'Documents'])
  })
})
