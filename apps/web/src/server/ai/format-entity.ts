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
  cvSummary?: string | null
  notes?: string | null
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

export type PharmacyLike = {
  name: string
  city?: string | null
  type?: string | null
  status?: string | null
  notes?: string | null
}

export function formatPharmacy(p: PharmacyLike): string {
  return toBlock([
    ['Pharmacie', p.name],
    ['Ville', p.city],
    ['Type', p.type],
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
