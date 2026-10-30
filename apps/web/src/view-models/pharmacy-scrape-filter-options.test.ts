import { describe, expect, it } from 'vitest'
import {
  pharmacyScrapeAllOption,
  toPharmacyScrapeFilterOptions,
} from '@/view-models/pharmacy-scrape-filter-options'

describe('pharmacy scrape filter options', () => {
  it('builds combobox options with an empty All entry', () => {
    expect(pharmacyScrapeAllOption('Tous')).toEqual({ value: '', label: 'Tous' })
    expect(toPharmacyScrapeFilterOptions(['69', '75'])).toEqual([
      { value: '69', label: '69' },
      { value: '75', label: '75' },
    ])
  })
})
