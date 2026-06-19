import { router, protectedProcedure } from '@/server/trpc'
import { jobOfferRepository } from '@/server/db/repositories/job-offer.repository'
import { toJobOfferListRow, type JobOfferListEntity } from '@/view-models/job-offer-list'

import { idSchema } from '@/lib/schemas/entity-id'

export type JobOfferDeps = {
  list: () => Promise<JobOfferListEntity[]>
  getById: (id: string) => ReturnType<typeof jobOfferRepository.findById>
}

export function makeJobOfferRouter(deps: JobOfferDeps) {
  return router({
    list: protectedProcedure.query(async () => (await deps.list()).map(toJobOfferListRow)),
    getById: protectedProcedure.input(idSchema).query(({ input }) => deps.getById(input.id)),
  })
}

export const jobOfferRouter = makeJobOfferRouter({
  list: () => jobOfferRepository.listForTable(),
  getById: (id) => jobOfferRepository.findById(id),
})
