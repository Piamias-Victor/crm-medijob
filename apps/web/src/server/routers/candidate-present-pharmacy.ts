import { TRPCError } from '@trpc/server'
import { mapAssistantChatError } from '@/server/ai/router-errors'
import { runPresentCandidateEmail } from '@/server/ai/present-candidate'
import type { AssistantProvider } from '@/server/ai/provider'
import type { PharmacyLike } from '@/server/ai/format-entity'
import { isValidEmailRecipient } from '@/lib/mailto/is-valid-email-recipient'
import type { CandidateDocumentsProfile } from '@/server/routers/candidate-documents-input'
import { toPresentCandidateInput } from '@/server/routers/candidate-present-pharmacy-input'
import type { PresentToPharmacyInput } from '@/server/routers/candidate-present-pharmacy.schema'

type PresentContact = {
  id: string
  pharmacyId: string
  email: string | null
}

export type CandidatePresentPharmacyDeps = {
  findDocumentsProfile: (id: string) => Promise<CandidateDocumentsProfile | null>
  findPharmacyForContext: (id: string) => Promise<PharmacyLike | null>
  findContactById: (id: string) => Promise<PresentContact | null>
  provider: AssistantProvider
}

export async function handlePresentToPharmacy(
  deps: CandidatePresentPharmacyDeps,
  input: PresentToPharmacyInput,
) {
  const [profile, pharmacy, contact] = await Promise.all([
    deps.findDocumentsProfile(input.candidateId),
    deps.findPharmacyForContext(input.pharmacyId),
    deps.findContactById(input.contactId),
  ])

  if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable.' })
  if (!pharmacy) throw new TRPCError({ code: 'NOT_FOUND', message: 'Pharmacie introuvable.' })
  if (!contact || contact.pharmacyId !== input.pharmacyId) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Contact invalide pour cette pharmacie.' })
  }

  const email = contact.email?.trim() ?? ''
  if (!isValidEmailRecipient(email)) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Le contact sélectionné n’a pas d’email valide.' })
  }

  try {
    const draft = await runPresentCandidateEmail(deps.provider, toPresentCandidateInput(profile, pharmacy))
    return { ...draft, to: email, contactId: contact.id }
  } catch (error) {
    throw mapAssistantChatError(error)
  }
}
