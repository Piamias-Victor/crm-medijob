import { TRPCError } from '@trpc/server'
import type { JobOfferStatus } from '@prisma/client'
import { mapAssistantChatError } from '@/server/ai/router-errors'
import {
  runJobOfferGenerate,
  type MissionOfferContext,
} from '@/server/ai/job-offer-generate'
import type { AssistantProvider } from '@/server/ai/provider'

type OfferRow = {
  id: string
  status: JobOfferStatus
  title: string
  content: string
}

export type GenerateOfferDeps = {
  findByMissionId: (missionId: string) => Promise<OfferRow | null>
  findMissionForOffer: (missionId: string) => Promise<(MissionOfferContext & { id: string }) | null>
  create: (data: {
    title: string
    content: string
    mission: { connect: { id: string } }
  }) => Promise<OfferRow>
  update: (
    id: string,
    data: { title: string; content: string; status?: JobOfferStatus },
  ) => Promise<OfferRow>
  provider: AssistantProvider
}

export async function handleGenerateJobOffer(deps: GenerateOfferDeps, missionId: string) {
  const mission = await deps.findMissionForOffer(missionId)
  if (!mission) throw new TRPCError({ code: 'NOT_FOUND', message: 'Mission introuvable.' })

  const existing = await deps.findByMissionId(missionId)
  if (existing?.status === 'PUBLIEE') {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Impossible de régénérer une offre publiée. Dépubliez-la d’abord.',
    })
  }

  try {
    const drafted = await runJobOfferGenerate(deps.provider, mission)
    if (existing) {
      return deps.update(existing.id, {
        title: drafted.title,
        content: drafted.content,
        status: 'BROUILLON',
      })
    }
    return deps.create({
      title: drafted.title,
      content: drafted.content,
      mission: { connect: { id: missionId } },
    })
  } catch (error) {
    throw mapAssistantChatError(error)
  }
}
