export function currentExerciceStartYear(now: Date): number {
  const year = now.getUTCFullYear()
  return now.getUTCMonth() >= 9 ? year : year - 1
}

export function exerciceLabel(startYear: number): string {
  return `${String(startYear).slice(-2)}/${String(startYear + 1).slice(-2)}`
}

export function exerciceFilterOptions(now: Date) {
  const current = currentExerciceStartYear(now)
  return [
    { value: String(current), label: exerciceLabel(current) },
    { value: String(current + 1), label: exerciceLabel(current + 1) },
    { value: 'all', label: 'Tous' },
  ]
}

export function exerciceWindow(startYear: number) {
  return {
    from: new Date(Date.UTC(startYear, 9, 1)),
    to: new Date(Date.UTC(startYear + 1, 8, 30, 23, 59, 59, 999)),
  }
}
