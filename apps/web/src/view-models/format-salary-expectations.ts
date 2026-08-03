type SalaryFields = {
  salaryExpectations: string | null
  salaryMin: number | null
  salaryMax: number | null
}

export function formatSalaryExpectations(fields: SalaryFields): string | null {
  const text = fields.salaryExpectations?.trim()
  if (text) return text
  if (fields.salaryMin != null || fields.salaryMax != null) {
    return `${fields.salaryMin ?? '—'} – ${fields.salaryMax ?? '—'} €`
  }
  return null
}
