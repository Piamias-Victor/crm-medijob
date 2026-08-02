import { TRPCError } from '@trpc/server'
import type { JobOfferStatus } from '@prisma/client'
import { offerResponseSchema } from '@/server/ai/schemas'

type OfferRow = {
  id: string
  status: JobOfferStatus
  title: string
  content: string
}

export type LifecycleDeps = {
  getById: (id: string) => Promise<OfferRow | null>
  update: (
    id: string,
    data: { status: JobOfferStatus; publishedAt?: Date | null },
  ) => Promise<OfferRow>
}

async function loadOffer(deps: LifecycleDeps, id: string) {
  const offer = await deps.getById(id)
  if (!offer) throw new TRPCError({ code: 'NOT_FOUND', message: 'Offre introuvable.' })
  return offer
}

export async function handlePublishJobOffer(deps: LifecycleDeps, id: string) {
  const offer = await loadOffer(deps, id)
  offerResponseSchema.parse({ title: offer.title, content: offer.content })
  if (offer.status === 'PUBLIEE') {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Offre déjà publiée.' })
  }
  return deps.update(id, { status: 'PUBLIEE', publishedAt: new Date() })
}

export async function handleUnpublishJobOffer(deps: LifecycleDeps, id: string) {
  const offer = await loadOffer(deps, id)
  if (offer.status !== 'PUBLIEE') {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Seule une offre publiée peut être dépubliée.' })
  }
  return deps.update(id, { status: 'DEPUBLIEE' })
}
