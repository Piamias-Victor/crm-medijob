import { describe, expect, it } from 'vitest'
import { filterComboboxOptions, shouldShowComboboxCreate } from './combobox-filter'

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
]

describe('filterComboboxOptions', () => {
  it('filters options by case-insensitive label', () => {
    expect(filterComboboxOptions(options, 'bet')).toEqual([{ value: 'b', label: 'Beta' }])
  })
})

describe('shouldShowComboboxCreate', () => {
  it('shows create when query is new', () => {
    expect(shouldShowComboboxCreate(options, 'Gamma', true)).toBe(true)
  })

  it('hides create for an existing label', () => {
    expect(shouldShowComboboxCreate(options, 'alpha', true)).toBe(false)
  })
})
