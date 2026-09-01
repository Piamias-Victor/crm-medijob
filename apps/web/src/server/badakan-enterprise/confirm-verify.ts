import { toPharmacyUpdateData } from '@/view-models/pharmacy-update'
import type { PharmacyUpdate } from '@/view-models/pharmacy-update'
import { previewEnterpriseVerify, type PreviewVerifyDeps } from './preview-verify'
import type { EnterpriseVerifyRow } from './verify.types'

export type VerifyContactCreate = {
  pharmacyId: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  contactRoleId: string
  isPrimary: true
}

export type ConfirmVerifyDeps = PreviewVerifyDeps & {
  createPharmacy: (data: PharmacyUpdate) => Promise<{ id: string }>
  createContact: (data: VerifyContactCreate) => Promise<{ id: string }>
  setPrimary: (id: string) => Promise<unknown>
  findTitulaireRoleId: () => Promise<string>
  markVerified: (id: string, pharmacyId: string) => Promise<unknown>
}

export type ConfirmVerifyResult = {
  pharmacyId: string
  contactId: string | null
  createdPharmacy: boolean
  createdContact: boolean
}

function toPharmacyInput(row: EnterpriseVerifyRow) {
  return toPharmacyUpdateData({
    name: row.name,
    siret: row.siret ?? undefined,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    postalCode: row.postalCode ?? undefined,
    status: 'PROSPECT',
  })
}

function principalNames(row: EnterpriseVerifyRow) {
  const firstName = row.principalFirstName?.trim()
  const lastName = row.principalLastName?.trim()
  if (!firstName || !lastName || firstName === '—' || lastName === '—') return null
  return { firstName, lastName }
}

export async function confirmEnterpriseVerify(
  row: EnterpriseVerifyRow,
  deps: ConfirmVerifyDeps,
): Promise<ConfirmVerifyResult> {
  const preview = await previewEnterpriseVerify(row, deps)
  const createdPharmacy = !preview.existingPharmacy
  const pharmacyId = preview.existingPharmacy?.id ?? (await deps.createPharmacy(toPharmacyInput(row))).id
  const names = principalNames(row)
  let contactId: string | null = preview.contactMatch?.id ?? null
  let createdContact = false
  if (preview.contactMatch) {
    await deps.setPrimary(preview.contactMatch.id)
  } else if (names) {
    const created = await deps.createContact({
      pharmacyId,
      firstName: names.firstName,
      lastName: names.lastName,
      email: row.principalEmail,
      phone: row.principalPhone,
      contactRoleId: await deps.findTitulaireRoleId(),
      isPrimary: true,
    })
    contactId = created.id
    createdContact = true
  }
  await deps.markVerified(row.id, pharmacyId)
  return { pharmacyId, contactId, createdPharmacy, createdContact }
}
