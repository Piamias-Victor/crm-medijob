/**
 * Republish JobOffers to the public board.
 * Default: --dry-run (no writes).
 * --apply: upserts via board port — NEVER run by CI/agent.
 *
 * Usage:
 *   pnpm --filter web exec tsx scripts/republish-job-offers.ts
 *   pnpm --filter web exec tsx scripts/republish-job-offers.ts --apply
 */
import { prisma } from '@/server/db/repositories/client'
import { NOT_DELETED } from '@/server/db/repositories/soft-delete'
import { buildListingForOffer } from '@/server/job-board/build-listing'
import { jobsBoardConfigured, readJobsBoardEnv } from '@/server/job-board/env'
import { createGeoQueryLookup } from '@/server/matching/distance'
import { createSupabaseListingsPort } from '@/server/job-board/supabase-listings'
import {
  formatDryRunSummary,
  listingRepublishReasons,
  toRepublishCandidate,
} from '@/server/job-board/republish-diff'

async function main() {
  const apply = process.argv.includes('--apply')
  const config = readJobsBoardEnv()
  if (!jobsBoardConfigured(config) || !config.contactEmail) {
    console.error('Job board env incomplete — abort')
    process.exit(1)
  }
  const offers = await prisma.jobOffer.findMany({
    where: { status: 'PUBLIEE', boardListingId: { not: null }, ...NOT_DELETED },
    include: {
      mission: {
        include: {
          jobTitle: true,
          pharmacy: { include: { software: true } },
        },
      },
    },
  })
  const lookup = createGeoQueryLookup()
  const candidates = []
  for (const offer of offers) {
    if (!offer.boardListingId) continue
    const mission = offer.mission
      ? {
          ...offer.mission,
          jobTitleName: offer.mission.jobTitle.name,
          pharmacy: {
            ...offer.mission.pharmacy,
            address: offer.mission.pharmacy.address,
          },
        }
      : null
    const listing = await buildListingForOffer(offer, mission, config.contactEmail, lookup)
    const reasons = listingRepublishReasons(offer.content, listing)
    const row = toRepublishCandidate(offer.id, offer.boardListingId, reasons)
    if (row) candidates.push(row)
    if (apply && row) {
      const board = createSupabaseListingsPort({ url: config.url, secret: config.secret })
      await board.upsert({ ...listing, id: offer.boardListingId, publiee: true })
    }
  }
  console.log(JSON.stringify({ apply, ...formatDryRunSummary(candidates) }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
