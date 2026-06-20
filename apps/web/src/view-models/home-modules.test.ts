import { describe, expect, it } from 'vitest'
import { buildHomeModules } from './home-modules'

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
    expect(modules[3]?.accent).toBe(true)
  })
})
