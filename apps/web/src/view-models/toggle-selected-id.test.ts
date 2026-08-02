// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { toggleSelectedId } from '@/view-models/toggle-selected-id'

describe('toggleSelectedId', () => {
  it('adds then removes id', () => {
    expect(toggleSelectedId([], 'c1')).toEqual(['c1'])
    expect(toggleSelectedId(['c1', 'c2'], 'c1')).toEqual(['c2'])
  })
})
