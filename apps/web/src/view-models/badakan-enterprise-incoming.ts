import type { EnterpriseVerifyRow } from '@/server/badakan-enterprise/verify.types'
import type { PharmacyDuplicateRow } from '@/view-models/pharmacy-duplicate-compare'

export function toIncomingPharmacyRow(row: EnterpriseVerifyRow): PharmacyDuplicateRow {
  return {
    name: row.name,
    siret: row.siret?.trim() ?? '',
    address: row.address ?? '',
    city: row.city ?? '',
    postalCode: row.postalCode ?? '',
    phone: row.principalPhone ?? '',
    email: row.principalEmail ?? '',
    status: 'PROSPECT',
    notes: '',
  }
}
