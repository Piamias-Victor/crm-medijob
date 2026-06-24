import { describe, it, expect } from 'vitest'
import { buildDefaultSelections } from '@/lib/merge/build-default-selections'
import { type DuplicateFieldConfig } from '@/lib/merge/duplicate-field-config'

type DemoRecord = {
  email: string
  firstName: string
}

const left: DemoRecord = {
  email: 'marie@existant.fr',
  firstName: 'Marie',
}

const right: DemoRecord = {
  email: 'marie.nouveau@example.com',
  firstName: 'Marie',
}

describe('buildDefaultSelections', () => {
  it('prefills left for fields that differ', () => {
    const fields: DuplicateFieldConfig<DemoRecord>[] = [
      { key: 'email', label: 'Email' },
      { key: 'firstName', label: 'Prénom' },
    ]

    expect(buildDefaultSelections(left, right, fields)).toEqual({ email: 'left' })
  })

  it('respects a custom equals function on a field', () => {
    const fields: DuplicateFieldConfig<DemoRecord>[] = [
      {
        key: 'firstName',
        label: 'Prénom',
        equals: (left, right) => left.toLowerCase() === right.toLowerCase(),
      },
    ]

    expect(buildDefaultSelections({ firstName: 'Marie', email: '' }, { firstName: 'marie', email: '' }, fields)).toEqual({})
  })
})
