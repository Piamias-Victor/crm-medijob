import { describe, it, expect } from 'vitest'
import { contextKey, didContextChange } from './context-reset'
import type { ContextValue } from './context'

describe('didContextChange', () => {
  it('detects entity type or id change', () => {
    const a: ContextValue = { entityType: 'candidate', entityId: 'c1' }
    const b: ContextValue = { entityType: 'candidate', entityId: 'c2' }
    expect(didContextChange(a, b)).toBe(true)
  })

  it('detects clear to empty context', () => {
    const a: ContextValue = { entityType: 'candidate', entityId: 'c1' }
    expect(didContextChange(a, {})).toBe(true)
  })

  it('ignores label-only changes on same entity', () => {
    const a: ContextValue = { entityType: 'candidate', entityId: 'c1', entityLabel: 'A' }
    const b: ContextValue = { entityType: 'candidate', entityId: 'c1', entityLabel: 'B' }
    expect(didContextChange(a, b)).toBe(false)
    expect(contextKey(a)).toBe(contextKey(b))
  })
})
