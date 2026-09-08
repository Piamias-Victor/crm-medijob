import { siretMatches } from '@/server/pharmacy/duplicate-identity-match'
import { confirmEnterpriseVerify, type ConfirmVerifyDeps } from './confirm-verify'
import type { EnterpriseVerifyRow, ExistingPharmacyIdentity } from './verify.types'

export type PromoteReadyDeps = ConfirmVerifyDeps & {
  listPending: () => Promise<EnterpriseVerifyRow[]>
}

export function isReadyToAutoCreate(
  row: Pick<EnterpriseVerifyRow, 'siret'>,
  existing: ExistingPharmacyIdentity | null,
) {
  return Boolean(row.siret?.trim()) && existing == null
}

async function existingFor(row: EnterpriseVerifyRow, deps: ConfirmVerifyDeps) {
  const siret = row.siret?.trim()
  if (!siret) return null
  const hit = await deps.findIdentityBySiret(siret)
  return hit && siretMatches(hit.siret, siret) ? hit : null
}

export async function promoteReadyEnterprises(deps: PromoteReadyDeps) {
  let created = 0
  let skipped = 0
  for (const row of await deps.listPending()) {
    if (!isReadyToAutoCreate(row, await existingFor(row, deps))) {
      skipped += 1
      continue
    }
    await confirmEnterpriseVerify(row, deps)
    created += 1
  }
  return { created, skipped }
}
