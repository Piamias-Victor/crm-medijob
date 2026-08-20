import { router, protectedProcedure, permissionProcedure } from '@/server/trpc'
import { jobOfferRepository } from '@/server/db/repositories/job-offer.repository'
import { toJobOfferListRow, type JobOfferListEntity } from '@/view-models/job-offer-list'
import { idSchema } from '@/lib/schemas/entity-id'
import { jobOfferMissionIdSchema, jobOfferUpdateSchema } from '@/lib/schemas/job-offer'
import { handleGenerateJobOffer } from '@/server/routers/job-offer-generate'
import {
  handlePublishJobOffer,
  handleUnpublishJobOffer,
} from '@/server/routers/job-offer-lifecycle'
import type { AssistantProvider } from '@/server/ai/provider'
import type { JobOfferStatus, Prisma } from '@prisma/client'
import type { BoardListing, JobBoardListingsPort } from '@/server/job-board/port'
import type { OfferLifecycleRow } from '@/server/routers/job-offer-lifecycle'

export type JobOfferDeps = {
  list: () => Promise<JobOfferListEntity[]>
  getById: (id: string) => ReturnType<typeof jobOfferRepository.findById>
  findByMissionId: (missionId: string) => ReturnType<typeof jobOfferRepository.findByMissionId>
  findMissionForOffer: (
    missionId: string,
  ) => ReturnType<typeof jobOfferRepository.findMissionForOffer>
  create: (data: Prisma.JobOfferCreateInput) => ReturnType<typeof jobOfferRepository.create>
  update: (
    id: string,
    data: {
      title?: string
      content?: string
      status?: JobOfferStatus
      publishedAt?: Date | null
      boardListingId?: string | null
    },
  ) => ReturnType<typeof jobOfferRepository.update>
  softDelete: (id: string) => ReturnType<typeof jobOfferRepository.softDelete>
  provider: AssistantProvider
  board: JobBoardListingsPort
  buildListing: (offer: OfferLifecycleRow) => Promise<BoardListing>
}

export function makeJobOfferRouter(deps: JobOfferDeps) {
  return router({
    list: protectedProcedure.query(async () => (await deps.list()).map(toJobOfferListRow)),
    getById: protectedProcedure.input(idSchema).query(({ input }) => deps.getById(input.id)),
    getByMissionId: protectedProcedure
      .input(jobOfferMissionIdSchema)
      .query(({ input }) => deps.findByMissionId(input.missionId)),
    generate: protectedProcedure
      .input(jobOfferMissionIdSchema)
      .mutation(({ input }) => handleGenerateJobOffer(deps, input.missionId)),
    update: protectedProcedure.input(jobOfferUpdateSchema).mutation(async ({ input }) => {
      const { id, ...data } = input
      return deps.update(id, data)
    }),
    publish: protectedProcedure
      .input(idSchema)
      .mutation(({ input }) => handlePublishJobOffer(deps, input.id)),
    unpublish: protectedProcedure
      .input(idSchema)
      .mutation(({ input }) => handleUnpublishJobOffer(deps, input.id)),
    softDelete: permissionProcedure('softDelete')
      .input(idSchema)
      .mutation(({ input }) => deps.softDelete(input.id)),
  })
}
