import type { AppProfileListItem } from '@/view-models/app-profile-list'

function digits(value: string): string {
  return value.replace(/\D/g, '')
}

export function matchesAppIntakeSearch(row: AppProfileListItem, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const haystack = [
    row.firstName,
    row.lastName,
    `${row.firstName} ${row.lastName}`,
    row.email,
    row.city,
    row.postalCode,
    row.jobTitleName,
    row.activityLabel,
    row.notes,
    row.badakanCommentsLabel,
    row.referentName,
    row.lastCalledByName,
  ]
    .filter(Boolean)
    .join('\n')
    .toLowerCase()
  if (haystack.includes(needle)) return true
  const phoneQuery = digits(query)
  const phone = digits(row.phone ?? '')
  return phoneQuery.length >= 2 && phone.includes(phoneQuery)
}
