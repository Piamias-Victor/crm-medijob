import { TRPCError } from '@trpc/server'
import type { JobOfferStatus } from '@prisma/client'
import { offerResponseSchema } from '@/server/ai/schemas'
import type { BoardListing, JobBoardListingsPort } from '@/server/job-board/port'

export type OfferLifecycleRow = {
  id: string
  missionId: string
  status: JobOfferStatus
  title: string
  content: string
  boardListingId: string | null
}

export type LifecycleDeps = {
  getById: (id: string) => Promise<OfferLifecycleRow | null>
  update: (
    id: string,
    data: {
      status: JobOfferStatus
      publishedAt?: Date | null
      boardListingId?: string | null
    },
  ) => Promise<OfferLifecycleRow>
  board: JobBoardListingsPort
  buildListing: (offer: OfferLifecycleRow) => Promise<BoardListing>
}

async function loadOffer(deps: LifecycleDeps, id: string) {
  const offer = await deps.getById(id)
  if (!offer) throw new TRPCError({ code: 'NOT_FOUND', message: 'Offre introuvable.' })
  return offer
}

async function writeBoard<T>(op: () => Promise<T>, message: string): Promise<T> {
  try {
    return await op()
  } catch {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message })
  }
}

export async function handlePublishJobOffer(deps: LifecycleDeps, id: string) {
  const offer = await loadOffer(deps, id)
  offerResponseSchema.parse({ title: offer.title, content: offer.content })
  if (offer.status === 'PUBLIEE') {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Offre déjà publiée.' })
  }
  const listing = await deps.buildListing(offer)
  const written = await writeBoard(
    () =>
      deps.board.upsert({
        ...listing,
        id: offer.boardListingId ?? listing.id,
        publiee: true,
        mise_en_avant: false,
      }),
    'Impossible de publier sur le site. Réessayez.',
  )
  return deps.update(id, {
    status: 'PUBLIEE',
    publishedAt: new Date(),
    boardListingId: written.id,
  })
}

export async function handleUnpublishJobOffer(deps: LifecycleDeps, id: string) {
  const offer = await loadOffer(deps, id)
  if (offer.status !== 'PUBLIEE') {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Seule une offre publiée peut être dépubliée.',
    })
  }
  const listingId = offer.boardListingId
  if (listingId) {
    await writeBoard(
      () => deps.board.setPubliee(listingId, false),
      'Impossible de dépublier sur le site. Réessayez.',
    )
  }
  return deps.update(id, { status: 'DEPUBLIEE' })
}
