import { devisPdfFilename } from '@/view-models/devis-pdf-filename'
import {
  buildDevisPdfModel,
  contactDisplayName,
  type DevisPdfModel,
} from '@/view-models/devis-pdf-model'
import type { DevisRecord } from '@/view-models/devis'
import type { DevisMissionRef } from '@/view-models/devis-mission-ref'

export type DevisPdfEntity = 'MISSION' | 'PHARMACY'

export type DevisPdfDocument = {
  id: string
  url: string
  name: string
  category: 'DEVIS'
  mimeType: 'application/pdf'
}

export type StoreDevisPdfDeps = {
  renderPdf: (model: DevisPdfModel) => Promise<Buffer>
  uploadBlob: (input: {
    pathname: string
    body: Buffer
    contentType: string
  }) => Promise<{ url: string }>
  createDocument: (data: {
    entityType: DevisPdfEntity
    category: 'DEVIS'
    name: string
    url: string
    size: number
    mimeType: string
    missionId?: string
    pharmacyId?: string
  }) => Promise<{ id: string; url: string }>
}

export async function storeDevisPdf(
  devis: DevisRecord,
  mission: DevisMissionRef,
  deps: StoreDevisPdfDeps,
  entity: DevisPdfEntity = 'MISSION',
): Promise<DevisPdfDocument> {
  const name = devisPdfFilename(devis.id)
  const buffer = await deps.renderPdf(
    buildDevisPdfModel({
      pharmacyName: mission.pharmacyName,
      contactName: contactDisplayName(mission.contact),
      kind: devis.kind,
      hours: devis.hours,
      hourlyRate: devis.hourlyRate,
      amountHt: devis.amountHt,
      amountTtc: devis.amountTtc,
      missionTitle: mission.title,
    }),
  )
  const folder = entity === 'PHARMACY' ? `pharmacy/${mission.pharmacyId}` : `mission/${mission.id}`
  const blob = await deps.uploadBlob({
    pathname: `${folder}/${name}`,
    body: buffer,
    contentType: 'application/pdf',
  })
  const doc = await deps.createDocument({
    entityType: entity,
    category: 'DEVIS',
    name,
    url: blob.url,
    size: buffer.length,
    mimeType: 'application/pdf',
    ...(entity === 'PHARMACY' ? { pharmacyId: mission.pharmacyId } : { missionId: mission.id }),
  })
  return { id: doc.id, url: doc.url, name, category: 'DEVIS', mimeType: 'application/pdf' }
}
