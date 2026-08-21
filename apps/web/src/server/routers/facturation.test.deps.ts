import { EMPTY_FACTURATION_OVERVIEW } from '@/view-models/facturation-overview'
import type { FacturationDeps } from '@/server/routers/facturation'

const emptyRefs = { pharmacies: [], recruiters: [], candidates: [], missions: [] }

const unusedCreateLine: FacturationDeps['createLine'] = async () => {
  throw new Error('createLine unused')
}

const unusedGenerateDevis: FacturationDeps['generateDevisFromLine'] = async () => {
  throw new Error('generateDevisFromLine unused')
}

export function facturationTestDeps(
  listSuivi: FacturationDeps['listSuivi'] = async () => [],
): FacturationDeps {
  return {
    listSuivi,
    overview: async () => EMPTY_FACTURATION_OVERVIEW,
    referentials: async () => emptyRefs,
    createLine: unusedCreateLine,
    generateDevisFromLine: unusedGenerateDevis,
  }
}
