import type { GlobalSearchHit } from './global-search'

export function mapPharmacyHit(row: {
  id: string
  name: string
  city?: string | null
}): GlobalSearchHit {
  return {
    id: row.id,
    label: row.name,
    sublabel: row.city ?? undefined,
    href: `/pharmacies/${row.id}`,
  }
}

export function mapContactHit(row: {
  id: string
  firstName: string
  lastName: string
  email: string | null
  pharmacy: { name: string }
}): GlobalSearchHit {
  return {
    id: row.id,
    label: `${row.firstName} ${row.lastName}`,
    sublabel: row.pharmacy.name || row.email || undefined,
    href: `/contacts/${row.id}`,
  }
}

export function mapCandidateHit(row: {
  id: string
  firstName: string
  lastName: string
  city?: string | null
}): GlobalSearchHit {
  return {
    id: row.id,
    label: `${row.firstName} ${row.lastName}`,
    sublabel: row.city ?? undefined,
    href: `/candidats/${row.id}`,
  }
}

export function mapMissionHit(row: {
  id: string
  title: string
  contractType?: string | null
}): GlobalSearchHit {
  return {
    id: row.id,
    label: row.title,
    sublabel: row.contractType ?? undefined,
    href: `/missions/${row.id}`,
  }
}
