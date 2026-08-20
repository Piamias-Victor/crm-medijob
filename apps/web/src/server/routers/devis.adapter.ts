import { devisRepository } from '@/server/db/repositories/devis.repository'
import { documentRepository } from '@/server/db/repositories/document.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import { contactRepository } from '@/server/db/repositories/contact.repository'
import { activityLogRepository } from '@/server/db/repositories/activity-log.repository'
import { makeDevisRouter } from '@/server/routers/devis'
import { uploadBlob, vercelBlobClient } from '@/server/services/blob'
import { renderDevisPdf } from '@/server/pdf/render-devis-pdf'
import type { DevisMissionRef } from '@/view-models/devis-mission-ref'

async function findMission(id: string): Promise<DevisMissionRef | null> {
  const mission = await missionRepository.findDetailById(id)
  if (!mission) return null
  const contactRow = mission.contactId ? await contactRepository.findById(mission.contactId) : null
  return {
    id: mission.id,
    title: mission.title,
    pharmacyId: mission.pharmacyId,
    pharmacyName: mission.pharmacy.name,
    contact: contactRow
      ? { firstName: contactRow.firstName, lastName: contactRow.lastName, email: contactRow.email }
      : null,
  }
}

export const devisRouter = makeDevisRouter({
  findMission,
  findDraftByMission: (missionId) => devisRepository.findDraftByMission(missionId),
  createDraft: (data) => devisRepository.createDraft(data),
  updateDraft: (id, data) => devisRepository.updateDraft(id, data),
  markSent: (id) => devisRepository.markSent(id),
  listByMission: (missionId) => devisRepository.listByMission(missionId),
  softDeleteDraft: (id) => devisRepository.softDeleteDraft(id),
  renderPdf: (model) => renderDevisPdf(model),
  uploadBlob: (input) => uploadBlob(vercelBlobClient, input),
  createDocument: (data) => documentRepository.create(data),
  findPrimaryContact: (pharmacyId) => contactRepository.findPrimaryForDevis(pharmacyId),
  logActivity: (input) => activityLogRepository.create(input),
})
