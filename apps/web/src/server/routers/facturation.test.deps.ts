import { EMPTY_FACTURATION_OVERVIEW } from '@/view-models/facturation-overview'
import type { FacturationDeps } from '@/server/routers/facturation'

const emptyRefs = { pharmacies: [], recruiters: [] }

export function facturationTestDeps(
  listSuivi: FacturationDeps['listSuivi'] = async () => [],
): FacturationDeps {
  return {
    listSuivi,
    overview: async () => EMPTY_FACTURATION_OVERVIEW,
    referentials: async () => emptyRefs,
  }
}