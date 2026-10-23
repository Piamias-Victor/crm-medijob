import { wouldCreateCycle } from '@/server/sponsorship/would-create-cycle'

export type SponsorshipRow = {
  id: string
  name: string
  sponsorId: string | null
}

export type LinkSponsorInput = {
  filleuleId: string
  sponsorId: string
  confirmTransfer?: boolean
}

export type LinkSponsorDeps = {
  findActive: (id: string) => Promise<SponsorshipRow | null>
  findSponsorId: (id: string) => Promise<string | null>
  setSponsorId: (filleuleId: string, sponsorId: string | null) => Promise<void>
  logActivity: (input: {
    entityId: string
    authorId: string
    content: string
  }) => Promise<void>
}

export async function linkSponsor(
  input: LinkSponsorInput,
  authorId: string,
  deps: LinkSponsorDeps,
): Promise<void> {
  if (input.filleuleId === input.sponsorId) throw new Error('SPONSORSHIP_SELF')

  const filleule = await deps.findActive(input.filleuleId)
  const marraine = await deps.findActive(input.sponsorId)
  if (!filleule || !marraine) throw new Error('SPONSORSHIP_NOT_FOUND')
  if (filleule.sponsorId === input.sponsorId) return

  if (await wouldCreateCycle(input.filleuleId, input.sponsorId, deps.findSponsorId)) {
    throw new Error('SPONSORSHIP_CYCLE')
  }

  const previousId = filleule.sponsorId
  if (previousId && !input.confirmTransfer) {
    throw new Error('SPONSORSHIP_TRANSFER_REQUIRED')
  }

  if (previousId) {
    await deps.logActivity({
      entityId: previousId,
      authorId,
      content: `Parrainage — filleule retirée : ${filleule.name}`,
    })
  }

  await deps.setSponsorId(input.filleuleId, input.sponsorId)
  await deps.logActivity({
    entityId: input.filleuleId,
    authorId,
    content: `Parrainage — marraine définie : ${marraine.name}`,
  })
  await deps.logActivity({
    entityId: input.sponsorId,
    authorId,
    content: `Parrainage — filleule ajoutée : ${filleule.name}`,
  })
}
