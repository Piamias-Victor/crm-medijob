import { describe, expect, it } from 'vitest'
import { applicationSourceLabel } from '@/view-models/application-source.labels'

describe('applicationSourceLabel', () => {
  it('labels board ingest and public apply', () => {
    expect(applicationSourceLabel('BOARD_INGEST')).toBe('Site (board)')
    expect(applicationSourceLabel('PUBLIC_APPLY')).toBe('Page postuler')
  })
})
