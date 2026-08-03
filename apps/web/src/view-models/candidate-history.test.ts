import { describe, it, expect } from 'vitest'
import {
  toCandidateHistoryItems,
  toCandidateHistoryPositionings,
} from '@/view-models/candidate-history'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { CandidateHistoryPositioning } from '@/view-models/candidate-history.types'

const log = (overrides: Partial<ActivityLogRow> & Pick<ActivityLogRow, 'id' | 'date'>): ActivityLogRow => ({
  type: 'NOTE',
  typeLabel: 'Note',
  content: 'Note manuelle',
  authorName: 'Alice',
  ...overrides,
})

const positioning = (
  overrides: Partial<CandidateHistoryPositioning> & Pick<CandidateHistoryPositioning, 'id' | 'date'>,
): CandidateHistoryPositioning => ({
  title: 'Mission',
  stageName: 'Présenté',
  ...overrides,
})

describe('toCandidateHistoryItems', () => {
  it('merges activity logs and all positionings sorted by date desc', () => {
    const items = toCandidateHistoryItems(
      [
        log({ id: 'l1', date: new Date('2026-03-01'), content: 'Note récente' }),
        log({ id: 'l2', date: new Date('2026-01-15'), content: 'Fiche créée' }),
      ],
      [
        positioning({
          id: 'm1',
          date: new Date('2026-02-20'),
          title: 'Titulaire CDI',
          stageName: 'Entretien',
        }),
        positioning({
          id: 'm2',
          date: new Date('2026-03-05'),
          title: 'Adjoint CDD',
          stageName: 'Nouveau',
        }),
      ],
    )

    expect(items.map((item) => item.id)).toEqual(['m2', 'l1', 'm1', 'l2'])
    expect(items[0]).toMatchObject({ kind: 'positioning', title: 'Adjoint CDD', stageName: 'Nouveau' })
    expect(items[1]).toMatchObject({ kind: 'log', content: 'Note récente' })
  })

  it('includes active and terminal positionings in the timeline', () => {
    const items = toCandidateHistoryItems(
      [],
      [
        positioning({ id: 'active', date: new Date('2026-04-01'), stageName: 'Présenté' }),
        positioning({ id: 'done', date: new Date('2026-03-01'), stageName: 'Placé' }),
      ],
    )
    expect(items).toHaveLength(2)
    expect(items.every((item) => item.kind === 'positioning')).toBe(true)
  })

  it('maps raw mission rows to history positionings via updatedAt', () => {
    const rows = toCandidateHistoryPositionings([
      {
        updatedAt: new Date('2026-02-10'),
        stage: { id: 's1', name: 'Présenté', position: 2 },
        mission: { id: 'm1', title: 'Titulaire', status: 'A_POURVOIR' },
      },
      {
        updatedAt: new Date('2026-01-01'),
        stage: { id: 's2', name: 'Placé', position: 5 },
        mission: { id: 'm2', title: 'Adjoint', status: 'POURVU' },
      },
    ])
    expect(rows).toEqual([
      { id: 'm1', title: 'Titulaire', stageName: 'Présenté', date: new Date('2026-02-10') },
      { id: 'm2', title: 'Adjoint', stageName: 'Placé', date: new Date('2026-01-01') },
    ])
  })
})
