export type BestProfileScore = {
  candidateId: string
  fullName: string
  jobTitle: string
  city: string | null
  score: number
  justification: string
}

export function formatBestProfilesContext(input: {
  scored: BestProfileScore[]
  topN: number
}): string {
  const top = input.scored.slice(0, input.topN)
  const lines = [
    'Meilleurs profils (matching CRM) — s’appuyer uniquement sur cette liste.',
  ]
  if (top.length === 0) {
    lines.push('aucun candidat scoré')
    return lines.join('\n')
  }
  top.forEach((row, index) => {
    const city = row.city ?? 'ville inconnue'
    lines.push(
      `${index + 1}. ${row.fullName} (${row.jobTitle}, ${city}) — score ${row.score}: ${row.justification}`,
    )
  })
  return lines.join('\n')
}
