import type { JobOfferStatus } from '@prisma/client'

type ClosedOfferRow = {
  id: string
  status: JobOfferStatus
}

export type UnpublishOnCloseDeps = {
  findByMissionId: (missionId: string) => Promise<ClosedOfferRow | null>
  unpublish: (id: string) => Promise<unknown>
}

export async function unpublishOfferForClosedMission(
  deps: UnpublishOnCloseDeps,
  missionId: string,
) {
  const offer = await deps.findByMissionId(missionId)
  if (!offer || offer.status !== 'PUBLIEE') return
  await deps.unpublish(offer.id)
}
