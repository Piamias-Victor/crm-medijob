import { router, protectedProcedure } from '@/server/trpc'
import { globalSearchInputSchema } from '@/server/routers/search.schema'
import { globalSearch } from '@/server/search/global-search'
import type { GlobalSearchResult } from '@/server/search/global-search'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { contactRepository } from '@/server/db/repositories/contact.repository'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'

export type SearchRouterDeps = {
  global: (term: string) => Promise<GlobalSearchResult>
}

export function makeSearchRouter(deps: SearchRouterDeps) {
  return router({
    global: protectedProcedure
      .input(globalSearchInputSchema)
      .query(({ input }) => deps.global(input.term)),
  })
}

export const searchRouter = makeSearchRouter({
  global: (term) =>
    globalSearch(term, {
      pharmacy: pharmacyRepository,
      contact: contactRepository,
      candidate: candidateRepository,
      mission: missionRepository,
    }),
})
