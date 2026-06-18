import { describe, it, expect } from 'vitest'
import { MISSION_STATUS_ORDER } from '@/lib/mission-options'
import { MISSION_STATUS_THEME } from '@/lib/mission-status-theme'

describe('MISSION_STATUS_THEME', () => {
  it('defines a distinct visual theme for every mission status', () => {
    for (const status of MISSION_STATUS_ORDER) {
      const theme = MISSION_STATUS_THEME[status]
      expect(theme.badge).toBeTruthy()
      expect(theme.dot).toBeTruthy()
      expect(theme.columnBorder).toBeTruthy()
      expect(theme.columnBg).toBeTruthy()
      expect(theme.countBadge).toBeTruthy()
    }
  })

  it('uses different badge variants across active pipeline statuses', () => {
    const active = ['A_POURVOIR', 'EN_RECHERCHE', 'CANDIDATS_PRESENTES', 'ENTRETIEN_EN_COURS'] as const
    const badges = new Set(active.map((status) => MISSION_STATUS_THEME[status].badge))
    expect(badges.size).toBe(active.length)
  })
})
