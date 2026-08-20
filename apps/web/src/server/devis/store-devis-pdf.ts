import { devisPdfFilename } from '@/view-models/devis-pdf-filename'
import {
  buildDevisPdfModel,
  contactDisplayName,
  type DevisPdfModel,
} from '@/view-models/devis-pdf-model'
import type { DevisRecord } from '@/view-models/devis'
import type { DevisMissionRef } from '@/view-models/devis-mission-ref'

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
    entityType: 'MISSION'
    category: 'DEVIS'
    name: string
    url: string
    size: number
    mimeType: string
    missionId: string
  }) => Promise<{ id: string; url: string }>
}

export async function storeDevisPdf(
  devis: DevisRecord,
  mission: DevisMissionRef,
  deps: StoreDevisPdfDeps,
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
  const blob = await deps.uploadBlob({
    pathname: `mission/${mission.id}/${name}`,
    body: buffer,
    contentType: 'application/pdf',
  })
  const doc = await deps.createDocument({
    entityType: 'MISSION',
    category: 'DEVIS',
    name,
    url: blob.url,
    size: buffer.length,
    mimeType: 'application/pdf',
    missionId: mission.id,
  })
  return { id: doc.id, url: doc.url, name, category: 'DEVIS', mimeType: 'application/pdf' }
}
