import { describe, it, expect } from 'vitest'
import { resolveMergedFields } from '@/lib/merge/resolve-merged-fields'

type DemoRecord = {
  firstName: string
  lastName: string
  email: string
}

const left: DemoRecord = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie@existant.fr',
}

const right: DemoRecord = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie.nouveau@example.com',
}

describe('resolveMergedFields', () => {
  it('keeps the right value when the field selection is right', () => {
    const merged = resolveMergedFields(left, right, { email: 'right' }, ['email'])

    expect(merged.email).toBe('marie.nouveau@example.com')
  })

  it('defaults to the left value when no selection is provided', () => {
    const merged = resolveMergedFields(left, right, {}, ['email'])

    expect(merged.email).toBe('marie@existant.fr')
  })

  it('keeps unconfigured keys from the left record', () => {
    const merged = resolveMergedFields(left, right, { email: 'right' }, ['email'])

    expect(merged.firstName).toBe('Marie')
    expect(merged.lastName).toBe('Dupont')
  })

  it('resolves equal configured fields to the shared value', () => {
    const merged = resolveMergedFields(left, right, { firstName: 'right' }, ['firstName'])

    expect(merged.firstName).toBe('Marie')
  })
})
