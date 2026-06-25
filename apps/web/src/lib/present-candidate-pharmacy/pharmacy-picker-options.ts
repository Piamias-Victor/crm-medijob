import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'

type SearchResult = { id: string; label: string }

export function buildPharmacyPickerOptions(
  searched: SearchResult[],
  selectedId: string,
  selectedLabel: string,
): ComboboxOption[] {
  const options = searched.map((row) => ({ value: row.id, label: row.label }))
  if (selectedId && selectedLabel && !options.some((row) => row.value === selectedId)) {
    return [{ value: selectedId, label: selectedLabel }, ...options]
  }
  return options
}
