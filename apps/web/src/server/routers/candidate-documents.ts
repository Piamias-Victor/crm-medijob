import { TRPCError } from '@trpc/server'
import { mapAssistantChatError } from '@/server/ai/router-errors'
import { runCandidateAnonymized } from '@/server/ai/candidate-anonymized'
import { assertAnonymizedDossierSafe } from '@/server/ai/candidate-anonymized-pii-dossier'
import { runCandidateSummary } from '@/server/ai/candidate-summary'
import type { AssistantProvider } from '@/server/ai/provider'
import {
  piiTokens,
  toAnonymizedInput,
  toSummaryInput,
  type CandidateDocumentsProfile,
} from '@/server/routers/candidate-documents-input'
import {
  serializeAnonymizedDossier,
  type AnonymizedDossier,
} from '@/view-models/anonymized-dossier'

export type CandidateDocumentsDeps = {
  findDocumentsProfile: (id: string) => Promise<CandidateDocumentsProfile | null>
  updateDerivedFields: (
    id: string,
    fields: { cvSummary?: string; anonymizedProfile?: string },
  ) => Promise<CandidateDocumentsProfile | null>
  provider: AssistantProvider
}

export async function handleGenerateSummary(deps: CandidateDocumentsDeps, candidateId: string) {
  const profile = await deps.findDocumentsProfile(candidateId)
  if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable.' })

  try {
    const cvSummary = await runCandidateSummary(deps.provider, toSummaryInput(profile))
    const updated = await deps.updateDerivedFields(candidateId, { cvSummary })
    return { cvSummary: updated?.cvSummary ?? cvSummary }
  } catch (error) {
    throw mapAssistantChatError(error)
  }
}

export async function handleSaveCvSummary(
  deps: CandidateDocumentsDeps,
  candidateId: string,
  cvSummary: string,
) {
  const profile = await deps.findDocumentsProfile(candidateId)
  if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable.' })

  const updated = await deps.updateDerivedFields(candidateId, { cvSummary })
  return { cvSummary: updated?.cvSummary ?? cvSummary }
}

export async function handleGenerateAnonymized(deps: CandidateDocumentsDeps, candidateId: string) {
  const profile = await deps.findDocumentsProfile(candidateId)
  if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable.' })

  try {
    const dossier = await runCandidateAnonymized(deps.provider, toAnonymizedInput(profile))
    const anonymizedProfile = serializeAnonymizedDossier(dossier)
    const updated = await deps.updateDerivedFields(candidateId, { anonymizedProfile })
    return { anonymizedProfile: updated?.anonymizedProfile ?? anonymizedProfile }
  } catch (error) {
    if (error instanceof Error && error.message === 'CV_SUMMARY_REQUIRED') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Générez d’abord le résumé IA.',
      })
    }
    throw mapAssistantChatError(error)
  }
}

export async function handleSaveAnonymized(
  deps: CandidateDocumentsDeps,
  candidateId: string,
  dossier: AnonymizedDossier,
) {
  const profile = await deps.findDocumentsProfile(candidateId)
  if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable.' })

  try {
    assertAnonymizedDossierSafe(dossier, piiTokens(profile))
    const anonymizedProfile = serializeAnonymizedDossier(dossier)
    const updated = await deps.updateDerivedFields(candidateId, { anonymizedProfile })
    return { anonymizedProfile: updated?.anonymizedProfile ?? anonymizedProfile }
  } catch (error) {
    throw mapAssistantChatError(error)
  }
}
