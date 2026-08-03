import {
  EMPTY_GLOBAL_SEARCH,
  GLOBAL_SEARCH_LIMIT,
  GLOBAL_SEARCH_MIN_TERM,
} from '@/lib/constants/global-search'
import {
  mapCandidateHit,
  mapContactHit,
  mapMissionHit,
  mapPharmacyHit,
} from './global-search-map'

export type GlobalSearchHit = {
  id: string
  label: string
  sublabel?: string
  href: string
}

export type GlobalSearchResult = {
  pharmacies: GlobalSearchHit[]
  contacts: GlobalSearchHit[]
  candidates: GlobalSearchHit[]
  missions: GlobalSearchHit[]
}

type Searcher<T> = { search: (term: string, limit?: number) => Promise<T[]> }

export type GlobalSearchRepos = {
  pharmacy: Searcher<{ id: string; name: string; city?: string | null }>
  contact: Searcher<{
    id: string
    firstName: string
    lastName: string
    email: string | null
    pharmacy: { name: string }
  }>
  candidate: Searcher<{
    id: string
    firstName: string
    lastName: string
    city?: string | null
  }>
  mission: Searcher<{ id: string; title: string; contractType?: string | null }>
}

function emptyResult(): GlobalSearchResult {
  return {
    pharmacies: [...EMPTY_GLOBAL_SEARCH.pharmacies],
    contacts: [...EMPTY_GLOBAL_SEARCH.contacts],
    candidates: [...EMPTY_GLOBAL_SEARCH.candidates],
    missions: [...EMPTY_GLOBAL_SEARCH.missions],
  }
}

export async function globalSearch(
  term: string,
  repos: GlobalSearchRepos,
): Promise<GlobalSearchResult> {
  const query = term.trim()
  if (query.length < GLOBAL_SEARCH_MIN_TERM) return emptyResult()

  const [pharmacies, contacts, candidates, missions] = await Promise.all([
    repos.pharmacy.search(query, GLOBAL_SEARCH_LIMIT),
    repos.contact.search(query, GLOBAL_SEARCH_LIMIT),
    repos.candidate.search(query, GLOBAL_SEARCH_LIMIT),
    repos.mission.search(query, GLOBAL_SEARCH_LIMIT),
  ])

  return {
    pharmacies: pharmacies.map(mapPharmacyHit),
    contacts: contacts.map(mapContactHit),
    candidates: candidates.map(mapCandidateHit),
    missions: missions.map(mapMissionHit),
  }
}
