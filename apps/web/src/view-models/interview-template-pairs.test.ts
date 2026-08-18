import { describe, expect, it } from 'vitest'
import { mergeInterviewTemplatePairs } from '@/view-models/interview-template-pairs'

describe('mergeInterviewTemplatePairs', () => {
  it('marks a working copy as archived without dropping the published pair', () => {
    const pairs = mergeInterviewTemplatePairs(
      [{ profileKey: 'pharmacien', mode: 'INTERIM' }],
      [{ profileKey: 'pharmacien', mode: 'INTERIM', archivedAt: new Date('2026-08-18') }],
    )
    expect(pairs).toEqual([{ profileKey: 'pharmacien', mode: 'INTERIM', archived: true }])
  })

  it('includes an unpublished working copy', () => {
    const pairs = mergeInterviewTemplatePairs(
      [],
      [{ profileKey: 'nouveau', mode: 'CDD_CDI', archivedAt: null }],
    )
    expect(pairs).toEqual([{ profileKey: 'nouveau', mode: 'CDD_CDI', archived: false }])
  })
})
