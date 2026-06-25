import { TRPCError } from '@trpc/server'
import { mapAssistantChatError } from '@/server/ai/router-errors'
import { runPresentCandidateRadiusEmail } from '@/server/ai/present-candidate-radius'
import type { AssistantProvider } from '@/server/ai/provider'
import type { CandidateDocumentsProfile } from '@/server/routers/candidate-documents-input'
import { toPresentCandidateRadiusInput } from '@/server/routers/candidate-present-radius-input'
import type { PresentInRadiusInput } from '@/server/routers/candidate-present-radius.schema'

export type CandidatePresentRadiusDeps = {
  findDocumentsProfile: (id: string) => Promise<CandidateDocumentsProfile | null>
  provider: AssistantProvider
}

export async function handlePresentInRadius(
  deps: CandidatePresentRadiusDeps,
  input: PresentInRadiusInput,
) {
  const profile = await deps.findDocumentsProfile(input.candidateId)
  if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable.' })

  try {
    return await runPresentCandidateRadiusEmail(deps.provider, toPresentCandidateRadiusInput(profile))
  } catch (error) {
    throw mapAssistantChatError(error)
  }
}
