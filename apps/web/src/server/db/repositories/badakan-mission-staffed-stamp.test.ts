import { describe, expect, it, vi } from 'vitest'
import { upsertBadakanMissionWithStaffedStamp } from './badakan-mission-staffed-stamp'

const now = new Date('2026-09-15T12:00:00.000Z')
const base = {
  badakanId: 'bk-1',
  identifier: null,
  pharmacyName: 'Pharma',
  enterpriseId: null,
  periods: [],
  activityId: null,
  activityLabel: null,
  softwareId: null,
  address: null,
  city: null,
  postalCode: null,
  latitude: null,
  longitude: null,
  softwareLabel: null,
  contactName: null,
  contactPhone: null,
  hourlyRate: null,
  reasonLabel: null,
  expectedRecipients: 1,
  staffedRecipients: 0,
  jobTitleId: null,
  searchApplied: [],
}

describe('upsertBadakanMissionWithStaffedStamp', () => {
  it('leaves staffedAt null on first sight already STAFFED', async () => {
    const upsert = vi.fn().mockResolvedValue({})
    const db = {
      badakanMission: {
        findUnique: vi.fn().mockResolvedValue(null),
        upsert,
      },
    }
    await upsertBadakanMissionWithStaffedStamp(
      db as never,
      { ...base, step: 'STAFFED' },
      now,
    )
    expect(upsert.mock.calls[0][0].create.staffedAt).toBeNull()
  })

  it('stamps on CREATED → STAFFED', async () => {
    const upsert = vi.fn().mockResolvedValue({})
    const db = {
      badakanMission: {
        findUnique: vi.fn().mockResolvedValue({ step: 'CREATED', staffedAt: null }),
        upsert,
      },
    }
    await upsertBadakanMissionWithStaffedStamp(
      db as never,
      { ...base, step: 'STAFFED' },
      now,
    )
    expect(upsert.mock.calls[0][0].update.staffedAt).toEqual(now)
  })

  it('keeps stamp on rollback to CREATED', async () => {
    const earlier = new Date('2026-09-01T00:00:00.000Z')
    const upsert = vi.fn().mockResolvedValue({})
    const db = {
      badakanMission: {
        findUnique: vi.fn().mockResolvedValue({ step: 'STAFFED', staffedAt: earlier }),
        upsert,
      },
    }
    await upsertBadakanMissionWithStaffedStamp(
      db as never,
      { ...base, step: 'CREATED' },
      now,
    )
    expect(upsert.mock.calls[0][0].update.staffedAt).toEqual(earlier)
  })
})
