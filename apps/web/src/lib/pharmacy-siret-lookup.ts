import type { PharmacySiretLookup } from '@/view-models/pharmacy-form.schema'

export type SiretSearchResolution =
  | { kind: 'empty' }
  | { kind: 'single'; match: PharmacySiretLookup }
  | { kind: 'multiple'; matches: PharmacySiretLookup[] }

export function resolveSiretSearchResults(results: PharmacySiretLookup[]): SiretSearchResolution {
  if (results.length === 0) return { kind: 'empty' }
  if (results.length === 1) return { kind: 'single', match: results[0]! }
  return { kind: 'multiple', matches: results }
}

export function formatSiretLookupLabel(match: PharmacySiretLookup): string {
  const location = [match.postalCode, match.city].filter(Boolean).join(' ')
  const siret = match.siret ? `SIRET ${match.siret}` : ''
  return [match.name, location, siret].filter(Boolean).join(' · ')
}
