export type PersonSearchRow = {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  city: string | null
}

function digits(value: string): string {
  return value.replace(/\D/g, '')
}

export function matchesPersonSearch(row: PersonSearchRow, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const haystack = [
    row.firstName,
    row.lastName,
    `${row.firstName} ${row.lastName}`,
    row.email,
    row.city,
  ]
    .filter(Boolean)
    .join('\n')
    .toLowerCase()
  if (haystack.includes(needle)) return true
  const phoneQuery = digits(query)
  const phone = digits(row.phone ?? '')
  return phoneQuery.length >= 2 && phone.includes(phoneQuery)
}

export function filterByPersonSearch<T extends PersonSearchRow>(rows: T[], query: string): T[] {
  return rows.filter((row) => matchesPersonSearch(row, query))
}
