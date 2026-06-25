type Field = [label: string, value: unknown]

function toBlock(fields: Field[]): string {
  return fields
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([label, value]) => `${label}: ${String(value)}`)
    .join('\n')
}

export type CandidateLike = {
  firstName: string
  lastName: string
  city?: string | null
  availableFrom?: Date | string | null
  mobilityRadiusKm?: number | null
  mobilityNotes?: string | null
  cvSummary?: string | null
  notes?: string | null
}

export type PresentCandidateLike = CandidateLike & {
  jobTitleName: string
  softwareNames: string[]
}

export function formatCandidate(c: CandidateLike): string {
  return toBlock([
    ['Candidat', `${c.firstName} ${c.lastName}`],
    ['Ville', c.city],
    ['Disponible à partir de', c.availableFrom],
    ['Rayon de mobilité (km)', c.mobilityRadiusKm],
    ['Résumé CV', c.cvSummary],
    ['Notes', c.notes],
  ])
}

export function formatPresentCandidate(c: PresentCandidateLike): string {
  const fields: Field[] = [
    ['Candidat', `${c.firstName} ${c.lastName}`],
    ['Métier', c.jobTitleName],
    ['Ville', c.city],
    ['Disponible à partir de', c.availableFrom],
    ['Rayon de mobilité (km)', c.mobilityRadiusKm],
  ]
  if (c.softwareNames.length > 0) fields.push(['Logiciels', c.softwareNames.join(', ')])
  if (c.mobilityNotes) fields.push(['Mobilité', c.mobilityNotes])
  if (c.cvSummary) fields.push(['Résumé CV', c.cvSummary])
  if (c.notes) fields.push(['Notes', c.notes])
  return toBlock(fields)
}

export type PharmacyLike = {
  name: string
  city?: string | null
  status?: string | null
  notes?: string | null
}

export function formatPharmacy(p: PharmacyLike): string {
  return toBlock([
    ['Pharmacie', p.name],
    ['Ville', p.city],
    ['Statut', p.status],
    ['Notes', p.notes],
  ])
}

export type MissionLike = {
  title: string
  contractType?: string | null
  startDate?: Date | string | null
  salaireMin?: number | null
  salaireMax?: number | null
  notes?: string | null
}

export function formatMission(m: MissionLike): string {
  return toBlock([
    ['Mission', m.title],
    ['Type de contrat', m.contractType],
    ['Début', m.startDate],
    ['Salaire min', m.salaireMin],
    ['Salaire max', m.salaireMax],
    ['Notes', m.notes],
  ])
}
