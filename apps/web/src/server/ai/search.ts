import type { ShortcutEntityType } from './shortcuts'

export type EntityOption = { id: string; label: string; sublabel?: string }

type Searcher<T> = { search: (term: string) => Promise<T[]> }

type CandidateRow = { id: string; firstName: string; lastName: string; city?: string | null }
type PharmacyRow = { id: string; name: string; city?: string | null }
type MissionRow = { id: string; title: string; contractType?: string | null }

export type SearchRepos = {
  candidate: Searcher<CandidateRow>
  pharmacy: Searcher<PharmacyRow>
  mission: Searcher<MissionRow>
}

export async function searchEntities(
  entityType: ShortcutEntityType,
  term: string,
  repos: SearchRepos,
): Promise<EntityOption[]> {
  const query = term.trim()
  if (!query) return []

  switch (entityType) {
    case 'candidate':
      return (await repos.candidate.search(query)).map((c) => ({
        id: c.id,
        label: `${c.firstName} ${c.lastName}`,
        sublabel: c.city ?? undefined,
      }))
    case 'pharmacy':
      return (await repos.pharmacy.search(query)).map((p) => ({
        id: p.id,
        label: p.name,
        sublabel: p.city ?? undefined,
      }))
    case 'mission':
      return (await repos.mission.search(query)).map((m) => ({
        id: m.id,
        label: m.title,
        sublabel: m.contractType ?? undefined,
      }))
  }
}
