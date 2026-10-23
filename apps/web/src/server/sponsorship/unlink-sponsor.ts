import type { LinkSponsorDeps } from '@/server/sponsorship/link-sponsor'

export type UnlinkSponsorInput = { filleuleId: string }

export async function unlinkSponsor(
  input: UnlinkSponsorInput,
  authorId: string,
  deps: LinkSponsorDeps,
): Promise<void> {
  const filleule = await deps.findActive(input.filleuleId)
  if (!filleule) throw new Error('SPONSORSHIP_NOT_FOUND')
  if (!filleule.sponsorId) return

  const previousId = filleule.sponsorId
  const marraine = await deps.findActive(previousId)
  await deps.setSponsorId(input.filleuleId, null)
  await deps.logActivity({
    entityId: input.filleuleId,
    authorId,
    content: `Parrainage — marraine retirée : ${marraine?.name ?? previousId}`,
  })
  await deps.logActivity({
    entityId: previousId,
    authorId,
    content: `Parrainage — filleule retirée : ${filleule.name}`,
  })
}
