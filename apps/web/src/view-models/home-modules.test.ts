import { describe, expect, it } from 'vitest'
import { buildHomeModules, HOME_ACTIONS } from './home-modules'
import { INTERVIEW_CTA } from './interview-copy'

describe('buildHomeModules', () => {
  it('maps overview counts to module tiles', () => {
    const modules = buildHomeModules({
      missionsActive: 3,
      candidates: 10,
      pharmacies: 5,
      inboxPending: 2,
    })
    expect(modules).toHaveLength(4)
    expect(modules[0]).toMatchObject({ label: 'Missions', value: 3, accent: true })
    expect(modules[3]).toMatchObject({
      label: 'Inbox',
      href: '/candidats?tab=inbox',
      accent: true,
    })
  })
})

describe('HOME_ACTIONS', () => {
  it('includes Nouvel entretien', () => {
    expect(HOME_ACTIONS.map((action) => action.label)).toContain(INTERVIEW_CTA)
  })
})
