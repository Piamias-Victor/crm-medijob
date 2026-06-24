import { phonesMatch } from '@/lib/phone-normalize'
import type { DuplicateIdentity } from '@/server/candidate/detect-duplicate.types'

export type DuplicateProbeIdentity = {
  email?: string | null
  firstName: string
  lastName: string
  phone?: string | null
}

const norm = (value: string) => value.trim().toLowerCase()

export function identityMatchesEmail(probeEmail: string, candidate: DuplicateIdentity): boolean {
  return Boolean(candidate.email && norm(candidate.email) === norm(probeEmail))
}

export function identityMatchesNamePhone(
  probe: DuplicateProbeIdentity,
  candidate: DuplicateIdentity,
): boolean {
  if (!probe.phone || !candidate.phone) return false
  return (
    phonesMatch(candidate.phone, probe.phone) &&
    norm(candidate.firstName) === norm(probe.firstName) &&
    norm(candidate.lastName) === norm(probe.lastName)
  )
}

export function pickEmailMatch(
  probe: DuplicateProbeIdentity,
  candidates: DuplicateIdentity[],
  excludeId?: string,
): DuplicateIdentity | null {
  if (!probe.email) return null
  return (
    candidates.find((candidate) => candidate.id !== excludeId && identityMatchesEmail(probe.email!, candidate)) ??
    null
  )
}

export function pickNamePhoneMatch(
  probe: DuplicateProbeIdentity,
  candidates: DuplicateIdentity[],
  excludeId?: string,
): DuplicateIdentity | null {
  if (!probe.firstName || !probe.lastName || !probe.phone) return null
  return (
    candidates.find(
      (candidate) => candidate.id !== excludeId && identityMatchesNamePhone(probe, candidate),
    ) ?? null
  )
}
