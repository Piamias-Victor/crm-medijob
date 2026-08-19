import { TRPCError } from '@trpc/server'
import { createAssistantProvider } from '@/server/ai/provider'
import { jobOfferRepository } from '@/server/db/repositories/job-offer.repository'
import { makeJobOfferRouter } from '@/server/routers/job-offer'
import { buildListingForOffer } from '@/server/job-board/build-listing'
import { jobsBoardConfigured, readJobsBoardEnv } from '@/server/job-board/env'
import type { JobBoardListingsPort } from '@/server/job-board/port'
import { createSupabaseListingsPort } from '@/server/job-board/supabase-listings'
import type { LifecycleDeps } from '@/server/routers/job-offer-lifecycle'
import { createGeoQueryLookup } from '@/server/matching/distance'

const UNCONFIGURED = 'Job board non configuré (JOBS_SUPABASE_* / JOBS_CONTACT_EMAIL).'

function failUnconfigured(): Promise<never> {
  return Promise.reject(new Error(UNCONFIGURED))
}

export function makeLiveJobOfferLifecycleDeps(): LifecycleDeps {
  const config = readJobsBoardEnv()
  const board: JobBoardListingsPort = jobsBoardConfigured(config)
    ? createSupabaseListingsPort({ url: config.url, secret: config.secret })
    : { upsert: failUnconfigured, setPubliee: failUnconfigured }
  const lookupGeo = createGeoQueryLookup()
  return {
    getById: (id) => jobOfferRepository.findById(id),
    update: (id, data) => jobOfferRepository.update(id, data),
    board,
    buildListing: async (offer) => {
      if (!config.contactEmail) {
        throw new TRPCError({ code: 'PRECONDITION_FAILED', message: UNCONFIGURED })
      }
      const mission = await jobOfferRepository.findMissionForOffer(offer.missionId)
      if (!mission) throw new TRPCError({ code: 'NOT_FOUND', message: 'Mission introuvable.' })
      return buildListingForOffer(offer, mission, config.contactEmail, lookupGeo)
    },
  }
}

const lifecycle = makeLiveJobOfferLifecycleDeps()

export const jobOfferRouter = makeJobOfferRouter({
  list: () => jobOfferRepository.listForTable(),
  getById: (id) => jobOfferRepository.findById(id),
  findByMissionId: (missionId) => jobOfferRepository.findByMissionId(missionId),
  findMissionForOffer: (missionId) => jobOfferRepository.findMissionForOffer(missionId),
  create: (data) => jobOfferRepository.create(data),
  update: (id, data) => jobOfferRepository.update(id, data),
  softDelete: (id) => jobOfferRepository.softDelete(id),
  provider: createAssistantProvider(),
  board: lifecycle.board,
  buildListing: lifecycle.buildListing,
})
