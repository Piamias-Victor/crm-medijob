import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import type { AppIdentityPatch } from '@/server/db/repositories/candidate-app-origin.repo'

const PLACEHOLDER = '—'

function present(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed || trimmed === PLACEHOLDER) return undefined
  return trimmed
}

export function identityPatchFromBadakan(
  row: BadakanRecipient,
  jobTitleId: string | null,
): AppIdentityPatch {
  const firstName = present(row.firstName)
  const lastName = present(row.lastName)
  const email = present(row.email)
  const phone = present(row.phone)
  const address = present(row.address)
  const city = present(row.city)
  const postalCode = present(row.postalCode)
  const nir = present(row.nir)
  const iban = present(row.iban)
  return {
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(address ? { address } : {}),
    ...(city ? { city } : {}),
    ...(postalCode ? { postalCode } : {}),
    ...(jobTitleId ? { jobTitleId } : {}),
    ...(nir ? { nir } : {}),
    ...(iban ? { iban } : {}),
  }
}
