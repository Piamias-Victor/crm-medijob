import { buildDevisPdfModel } from '@/view-models/devis-pdf-model'
import { resolveDevisDestinataire } from '@/view-models/devis-destinataire'
import type { DevisWriteFields } from '@/view-models/devis'
import type { DevisContactRef, DevisMissionRef } from '@/view-models/devis-mission-ref'
import { SendDevisError } from '@/server/devis/send-devis'

export type PreviewDevisPdfDeps = {
  findMission: (id: string) => Promise<DevisMissionRef | null>
  findPrimaryContact: (pharmacyId: string) => Promise<DevisContactRef | null>
}

export async function previewDevisQuote(
  fields: DevisWriteFields,
  mission: DevisMissionRef,
  deps: Pick<PreviewDevisPdfDeps, 'findPrimaryContact'>,
) {
  const primary = await deps.findPrimaryContact(mission.pharmacyId)
  const destinataire = resolveDevisDestinataire(mission.contact, primary)
  return {
    quote: buildDevisPdfModel({
      pharmacyName: mission.pharmacyName,
      contactName: destinataire.contactName,
      kind: fields.kind,
      hours: fields.hours,
      hourlyRate: fields.hourlyRate,
      amountHt: fields.amountHt,
      amountTtc: fields.amountTtc,
      missionTitle: mission.title,
    }),
  }
}

export async function previewDevisPdf(
  input: DevisWriteFields & { missionId: string },
  deps: PreviewDevisPdfDeps,
) {
  const mission = await deps.findMission(input.missionId)
  if (!mission) throw new SendDevisError('NOT_FOUND', 'Mission introuvable')
  return previewDevisQuote(input, mission, deps)
}
