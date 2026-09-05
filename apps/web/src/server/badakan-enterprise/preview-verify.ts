import { siretMatches } from '@/server/pharmacy/duplicate-identity-match'
import { pickContactMatch, type ContactMatchIdentity } from './pick-contact-match'
import type { EnterpriseVerifyRow, ExistingPharmacyIdentity } from './verify.types'

export type PreviewVerifyDeps = {
  findIdentityBySiret: (siret: string) => Promise<ExistingPharmacyIdentity | null>
  listContacts: (pharmacyId: string) => Promise<ContactMatchIdentity[]>
}

export async function previewEnterpriseVerify(
  row: EnterpriseVerifyRow,
  deps: PreviewVerifyDeps,
) {
  const siret = row.siret?.trim()
  const hit = siret ? await deps.findIdentityBySiret(siret) : null
  const existingPharmacy =
    hit && siret && siretMatches(hit.siret, siret) ? hit : null
  const contacts = existingPharmacy
    ? await deps.listContacts(existingPharmacy.id)
    : []
  return {
    existingPharmacy,
    contactMatch: pickContactMatch(
      { email: row.principalEmail, phone: row.principalPhone },
      contacts,
    ),
  }
}
