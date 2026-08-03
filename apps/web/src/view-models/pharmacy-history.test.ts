import { describe, it, expect } from 'vitest'
import { toPharmacyHistoryItems } from '@/view-models/pharmacy-history'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { PharmacyMissionRow } from '@/view-models/pharmacy-detail.types'

const log = (overrides: Partial<ActivityLogRow> & Pick<ActivityLogRow, 'id' | 'date'>): ActivityLogRow => ({
  type: 'NOTE',
  typeLabel: 'Note',
  content: 'Note manuelle',
  authorName: 'Alice',
  ...overrides,
})

const mission = (
  overrides: Partial<PharmacyMissionRow> & Pick<PharmacyMissionRow, 'id' | 'updatedAt'>,
): PharmacyMissionRow => ({
  title: 'Mission',
  status: 'POURVU',
  contractType: 'CDI',
  startDate: new Date('2026-01-01'),
  jobTitle: 'Pharmacien',
  referent: null,
  ...overrides,
})

describe('toPharmacyHistoryItems', () => {
  it('merges activity logs and terminal missions sorted by date desc', () => {
    const items = toPharmacyHistoryItems(
      [
        log({ id: 'l1', date: new Date('2026-03-01'), content: 'Note récente' }),
        log({ id: 'l2', date: new Date('2026-01-15'), content: 'Fiche créée' }),
      ],
      [
        mission({ id: 'm1', updatedAt: new Date('2026-02-20'), title: 'Pourvu CDD', status: 'POURVU' }),
        mission({ id: 'm2', updatedAt: new Date('2026-03-05'), title: 'Annulée', status: 'ANNULEE' }),
      ],
    )

    expect(items.map((item) => item.id)).toEqual(['m2', 'l1', 'm1', 'l2'])
    expect(items[0]).toMatchObject({ kind: 'mission', title: 'Annulée', status: 'ANNULEE' })
    expect(items[1]).toMatchObject({ kind: 'log', content: 'Note récente' })
  })

  it('keeps manual activity logs in the mixed timeline', () => {
    const items = toPharmacyHistoryItems(
      [log({ id: 'manual', date: new Date('2026-04-01'), content: 'Appel titulaire' })],
      [],
    )
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ kind: 'log', content: 'Appel titulaire' })
  })
})
