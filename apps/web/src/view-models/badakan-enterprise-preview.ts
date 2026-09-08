import type { EnterpriseVerifyRow } from '@/server/badakan-enterprise/verify.types'
import type { previewEnterpriseVerify } from '@/server/badakan-enterprise/preview-verify'
import { toIncomingPharmacyRow } from '@/view-models/badakan-enterprise-incoming'
import type { PharmacyDuplicateRow } from '@/view-models/pharmacy-duplicate-compare'

type Preview = Awaited<ReturnType<typeof previewEnterpriseVerify>>

export type BadakanEnterprisePreview = {
  id: string
  name: string
  statusLabel: string
  contactActionLabel: string
  confirmLabel: string
  existingPharmacyId: string | null
  existingPharmacyHref: string | null
  existingPharmacyName: string | null
  siret: string
  blockHint: string | null
  incomingPharmacy: PharmacyDuplicateRow
  fields: Array<{ label: string; value: string | null }>
}

function principalName(row: EnterpriseVerifyRow) {
  const parts = [row.principalFirstName, row.principalLastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : null
}

function contactActionLabel(preview: Preview): string {
  if (preview.contactMatch?.reason === 'email') return 'Fusionner par email'
  if (preview.contactMatch?.reason === 'phone') return 'Fusionner par téléphone'
  return 'Créer le contact principal'
}

export function toBadakanEnterprisePreview(
  row: EnterpriseVerifyRow,
  preview: Preview,
): BadakanEnterprisePreview {
  const existing = preview.existingPharmacy
  return {
    id: row.id,
    name: row.name,
    statusLabel: existing ? 'Pharmacie déjà dans le CRM' : 'Nouvelle pharmacie',
    contactActionLabel: contactActionLabel(preview),
    confirmLabel: existing ? 'Fusionner' : 'Créer la pharmacie',
    existingPharmacyId: existing?.id ?? null,
    existingPharmacyHref: existing ? `/pharmacies/${existing.id}` : null,
    existingPharmacyName: existing?.name ?? null,
    siret: row.siret?.trim() ?? '',
    incomingPharmacy: toIncomingPharmacyRow(row),
    blockHint: existing
      ? 'Ce SIRET est déjà dans le CRM. Comparez les fiches puis fusionnez.'
      : row.siret?.trim()
        ? null
        : 'SIRET manquant. Saisissez-le pour créer la pharmacie.',
    fields: [
      { label: 'Nom', value: row.name },
      { label: 'SIRET', value: row.siret },
      { label: 'Adresse', value: row.address },
      { label: 'Ville', value: row.city },
      { label: 'Code postal', value: row.postalCode },
      { label: 'Contact principal', value: principalName(row) },
      { label: 'Email', value: row.principalEmail },
      { label: 'Téléphone', value: row.principalPhone },
    ],
  }
}
