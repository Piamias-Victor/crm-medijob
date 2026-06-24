import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'

export function filterComboboxOptions(options: ComboboxOption[], query: string): ComboboxOption[] {
  const lower = query.toLowerCase()
  return options.filter((option) => option.label.toLowerCase().includes(lower))
}

export function shouldShowComboboxCreate(
  options: ComboboxOption[],
  query: string,
  canCreate: boolean,
): boolean {
  const trimmed = query.trim()
  if (!canCreate || !trimmed) return false
  return !options.some((option) => option.label.toLowerCase() === trimmed.toLowerCase())
}
