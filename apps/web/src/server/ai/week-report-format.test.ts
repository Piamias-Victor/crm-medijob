// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { formatWeekReportContext } from '@/server/ai/week-report-format'
import type { WeekReportStats } from '@/server/ai/week-report-assemble'

const stats: WeekReportStats = {
  referentId: 'u1',
  from: new Date('2026-08-02T22:00:00.000Z'),
  to: new Date('2026-08-09T22:00:00.000Z'),
  missionsOpen: 3,
  missionsFilled: 1,
  candidatesContacted: 4,
  applicationsReceived: 2,
  offersPublished: 1,
  commercialActions: 5,
}

describe('formatWeekReportContext', () => {
  it('renders labeled CRM metrics for the IA prompt', () => {
    const text = formatWeekReportContext(stats)
    expect(text).toContain('missions ouvertes: 3')
    expect(text).toContain('missions pourvues (semaine): 1')
    expect(text).toContain('candidats contactés: 4')
    expect(text).toContain('candidatures reçues: 2')
    expect(text).toContain('offres publiées: 1')
    expect(text).toContain('actions commerciales: 5')
    expect(text).toContain('référent: u1')
  })
})
