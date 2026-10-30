import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'

export function pharmacyScrapeAllOption(label: string): ComboboxOption {
  return { value: '', label }
}

export function toPharmacyScrapeFilterOptions(values: string[]): ComboboxOption[] {
  return values.map((value) => ({ value, label: value }))
}
