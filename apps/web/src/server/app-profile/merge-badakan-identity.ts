import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import type { AppIdentityPatch } from '@/server/db/repositories/candidate-app-origin.repo'

const PLACEHOLDER = '—'

export type ExistingBadakanIdentity = {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  postalCode?: string | null
  jobTitleId?: string | null
  jobTitleName?: string | null
  nir?: string | null
  iban?: string | null
}

function present(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed || trimmed === PLACEHOLDER) return undefined
  return trimmed
}

function take(
  incoming: string | undefined,
  current: string | null | undefined,
): string | undefined {
  if (!incoming) return undefined
  if (present(current)) return undefined
  return incoming
}

export function identityPatchFromBadakan(
  row: BadakanRecipient,
  jobTitleId: string | null,
  existing?: ExistingBadakanIdentity | null,
): AppIdentityPatch {
  const firstName = take(present(row.firstName), existing?.firstName)
  const lastName = take(present(row.lastName), existing?.lastName)
  const email = take(present(row.email), existing?.email)
  const phone = take(present(row.phone), existing?.phone)
  const address = take(present(row.address), existing?.address)
  const city = take(present(row.city), existing?.city)
  const postalCode = take(present(row.postalCode), existing?.postalCode)
  const nir = take(present(row.nir), existing?.nir)
  const iban = take(present(row.iban), existing?.iban)
  const mappedJob =
    jobTitleId &&
    (!present(existing?.jobTitleId) || existing?.jobTitleName === 'Autre')
      ? jobTitleId
      : null
  return {
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(address ? { address } : {}),
    ...(city ? { city } : {}),
    ...(postalCode ? { postalCode } : {}),
    ...(mappedJob ? { jobTitleId: mappedJob } : {}),
    ...(nir ? { nir } : {}),
    ...(iban ? { iban } : {}),
  }
}
