import { storeDevisPdf, type StoreDevisPdfDeps, type DevisPdfEntity } from '@/server/devis/store-devis-pdf'
import { buildComposeUrl } from '@/lib/mailto/build-compose-url'
import { resolveDevisDestinataire } from '@/view-models/devis-destinataire'
import { devisComposeBody, devisComposeSubject } from '@/view-models/devis-compose'
import { DEVIS_SENT_LOG } from '@/view-models/devis-copy'
import type { DevisRecord } from '@/view-models/devis'
import type { DevisContactRef, DevisMissionRef } from '@/view-models/devis-mission-ref'

export class SendDevisError extends Error {
  constructor(
    readonly code: 'NOT_FOUND' | 'BAD_REQUEST',
    message: string,
  ) {
    super(message)
    this.name = 'SendDevisError'
  }
}

export type SendDevisActivity = {
  entityType: 'MISSION' | 'PHARMACY'
  entityId: string
  authorId: string
  type: 'DEVIS'
  content: string
}

export type SendDevisDeps = StoreDevisPdfDeps & {
  findMission: (id: string) => Promise<DevisMissionRef | null>
  findDraftByMission: (missionId: string) => Promise<DevisRecord | null>
  markSent: (id: string) => Promise<DevisRecord | null>
  findPrimaryContact: (pharmacyId: string) => Promise<DevisContactRef | null>
  logActivity: (input: SendDevisActivity) => Promise<unknown>
}

export async function sendDraftDevis(
  draft: DevisRecord,
  mission: DevisMissionRef,
  authorId: string,
  deps: SendDevisDeps,
  log: Pick<SendDevisActivity, 'entityType' | 'entityId'>,
  entity: DevisPdfEntity = 'MISSION',
) {
  const primary = await deps.findPrimaryContact(mission.pharmacyId)
  const destinataire = resolveDevisDestinataire(mission.contact, primary)
  const document = await storeDevisPdf(
    draft,
    { ...mission, contact: mission.contact ?? primary },
    deps,
    entity,
  )
  const sent = await deps.markSent(draft.id)
  if (!sent) throw new SendDevisError('NOT_FOUND', 'Devis introuvable')
  await deps.logActivity({ ...log, authorId, type: 'DEVIS', content: DEVIS_SENT_LOG })
  return {
    devis: sent,
    document,
    composeUrl: buildComposeUrl(
      {
        to: destinataire.email,
        subject: devisComposeSubject(mission.title, mission.pharmacyName),
        body: devisComposeBody(destinataire.contactName, sent.kind),
      },
      'gmail',
    ),
  }
}

export async function sendDevis(missionId: string, authorId: string, deps: SendDevisDeps) {
  const mission = await deps.findMission(missionId)
  if (!mission) throw new SendDevisError('NOT_FOUND', 'Mission introuvable')
  const draft = await deps.findDraftByMission(missionId)
  if (!draft) throw new SendDevisError('BAD_REQUEST', 'Aucun brouillon à envoyer')
  return sendDraftDevis(draft, mission, authorId, deps, {
    entityType: 'MISSION',
    entityId: mission.id,
  })
}
