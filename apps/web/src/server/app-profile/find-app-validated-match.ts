import type { DuplicateIdentity } from '@/server/candidate/detect-duplicate.types'
import {
  pickAppValidatedMatch,
  type DuplicateProbeIdentity,
} from '@/server/candidate/duplicate-identity-match'

export type AppValidatedMatchDeps = {
  findIdentityByEmail: (email: string) => Promise<DuplicateIdentity | null>
  findIdentityByPhone: (phone: string) => Promise<DuplicateIdentity | null>
}

export async function findAppValidatedMatch(
  probe: DuplicateProbeIdentity,
  deps: AppValidatedMatchDeps,
): Promise<DuplicateIdentity | null> {
  if (probe.email) {
    const emailHit = await deps.findIdentityByEmail(probe.email)
    if (emailHit) return pickAppValidatedMatch(probe, [emailHit])
  }
  if (!probe.phone) return null
  const phoneHit = await deps.findIdentityByPhone(probe.phone)
  return phoneHit ? pickAppValidatedMatch(probe, [phoneHit]) : null
}
