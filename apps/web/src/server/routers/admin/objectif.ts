import { router, adminProcedure } from '@/server/trpc'
import { objectifRepository } from '@/server/db/repositories/objectif.repository'
import { objectifSchema } from '@/server/admin/objectif-schema'
import type { Objectif } from '@/view-models/objectif'

export type ObjectifDeps = {
  get: () => Promise<Objectif>
  save: (input: Objectif) => Promise<Objectif>
}

export function makeObjectifRouter(deps: ObjectifDeps) {
  return router({
    get: adminProcedure.query(() => deps.get()),
    save: adminProcedure.input(objectifSchema).mutation(({ input }) => deps.save(input)),
  })
}

export const objectifRouter = makeObjectifRouter({
  get: () => objectifRepository.get(),
  save: (input) => objectifRepository.save(input),
})
