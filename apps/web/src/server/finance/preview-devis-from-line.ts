import { TRPCError } from '@trpc/server'
import { previewDevisQuote } from '@/server/devis/preview-devis-pdf'
import { devisWriteFromLineForm } from '@/lib/finance/devis-from-finance-line'
import { devisMissionRefFromPharmacy } from '@/view-models/devis-mission-ref-from-line'
import type { DevisContactRef, DevisMissionRef } from '@/view-models/devis-mission-ref'
import type { FinanceLineDevisInput } from '@/view-models/finance-line.schema'

type PharmacyRef = { id: string; name: string }
type CandidateRef = { firstName: string; lastName: string }

export type ResolveDevisRefDeps = {
  findMission: (id: string) => Promise<DevisMissionRef | null>
  findPharmacy: (id: string) => Promise<PharmacyRef | null>
  findCandidate: (id: string) => Promise<CandidateRef | null>
  findPrimaryContact: (pharmacyId: string) => Promise<DevisContactRef | null>
}

export async function resolveDevisRefFromForm(
  input: FinanceLineDevisInput,
  deps: ResolveDevisRefDeps,
): Promise<DevisMissionRef> {
  if (input.missionId) {
    const mission = await deps.findMission(input.missionId)
    if (!mission) throw new TRPCError({ code: 'NOT_FOUND', message: 'Mission introuvable' })
    return mission
  }
  const [pharmacy, candidate] = await Promise.all([
    deps.findPharmacy(input.pharmacyId),
    deps.findCandidate(input.candidateId),
  ])
  if (!pharmacy) throw new TRPCError({ code: 'NOT_FOUND', message: 'Pharmacie introuvable' })
  if (!candidate) throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable' })
  return devisMissionRefFromPharmacy({
    pharmacyId: pharmacy.id,
    pharmacyName: pharmacy.name,
    candidateName: `${candidate.firstName} ${candidate.lastName}`.trim(),
  })
}

export async function previewDevisFromLineForm(
  input: FinanceLineDevisInput,
  deps: ResolveDevisRefDeps,
) {
  const mission = await resolveDevisRefFromForm(input, deps)
  return previewDevisQuote(devisWriteFromLineForm(input), mission, deps)
}
