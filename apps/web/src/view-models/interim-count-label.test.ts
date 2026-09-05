// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { interimCountLabel } from '@/view-models/interim-count-label'

describe('interimCountLabel', () => {
  it('stays singular below two items', () => {
    expect(interimCountLabel(0, 'mission')).toBe('0 mission')
    expect(interimCountLabel(1, 'mission')).toBe('1 mission')
  })

  it('pluralises beyond one item', () => {
    expect(interimCountLabel(65, 'mission')).toBe('65 missions')
    expect(interimCountLabel(25, 'officine')).toBe('25 officines')
  })
})
