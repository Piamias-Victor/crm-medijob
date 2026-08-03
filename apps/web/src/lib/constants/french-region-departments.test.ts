import { describe, it, expect } from 'vitest'
import {
  departmentsForRegions,
  FRENCH_REGION_OPTIONS,
} from '@/lib/constants/french-region-departments'

describe('departmentsForRegions', () => {
  it('expands Île-de-France to its departments', () => {
    expect(departmentsForRegions(['IDF']).sort()).toEqual(
      ['75', '77', '78', '91', '92', '93', '94', '95'].sort(),
    )
  })

  it('unions departments across selected regions', () => {
    expect(departmentsForRegions(['BRE', 'PDL']).sort()).toEqual(
      ['22', '29', '35', '44', '49', '53', '56', '72', '85'].sort(),
    )
  })

  it('ignores unknown region ids', () => {
    expect(departmentsForRegions(['ZZZ'])).toEqual([])
  })
})

describe('FRENCH_REGION_OPTIONS', () => {
  it('exposes twelve metropolitan regions', () => {
    expect(FRENCH_REGION_OPTIONS).toHaveLength(12)
    expect(FRENCH_REGION_OPTIONS.find((o) => o.value === 'IDF')?.label).toBe('Île-de-France')
  })
})
