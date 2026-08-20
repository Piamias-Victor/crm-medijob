import { describe, it, expect } from 'vitest'
import type { ActivityLogRow } from '@/view-models/activity-log'
import { filterActivityLogsByTypes } from '@/view-models/filter-activity-logs'

const note: ActivityLogRow = {
  id: '1',
  type: 'NOTE',
  typeLabel: 'Note',
  content: 'Note manuelle',
  date: new Date('2026-01-01'),
  authorName: 'Alice',
}

const call: ActivityLogRow = {
  id: '2',
  type: 'APPEL',
  typeLabel: 'Appel',
  content: 'Appel client',
  date: new Date('2026-01-02'),
  authorName: 'Alice',
}

describe('filterActivityLogsByTypes', () => {
  it('returns all logs when no type is selected', () => {
    expect(filterActivityLogsByTypes([note, call], [])).toEqual([note, call])
  })

  it('returns only logs matching selected types', () => {
    expect(filterActivityLogsByTypes([note, call], ['APPEL'])).toEqual([call])
  })
})
