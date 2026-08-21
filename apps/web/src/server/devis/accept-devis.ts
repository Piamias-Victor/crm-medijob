import { pickCurrentDevis } from '@/lib/finance/pick-current-devis'
import { SendDevisError, type SendDevisActivity } from '@/server/devis/send-devis'
import { DEVIS_ACCEPTED_LOG } from '@/view-models/devis-copy'
import type { DevisRecord } from '@/view-models/devis'

export type AcceptDevisDeps = {
  listByMission: (missionId: string) => Promise<DevisRecord[]>
  markAccepted: (id: string) => Promise<DevisRecord | null>
  logActivity: (input: SendDevisActivity) => Promise<unknown>
}

export async function acceptDevis(
  missionId: string,
  authorId: string,
  deps: AcceptDevisDeps,
) {
  const current = pickCurrentDevis(await deps.listByMission(missionId))
  if (!current || (current.status !== 'SENT' && current.status !== 'DRAFT')) {
    throw new SendDevisError('BAD_REQUEST', 'Aucun devis à accepter')
  }
  const accepted = await deps.markAccepted(current.id)
  if (!accepted) throw new SendDevisError('NOT_FOUND', 'Devis introuvable')
  await deps.logActivity({
    entityType: 'MISSION',
    entityId: missionId,
    authorId,
    type: 'DEVIS',
    content: DEVIS_ACCEPTED_LOG,
  })
  return accepted
}
