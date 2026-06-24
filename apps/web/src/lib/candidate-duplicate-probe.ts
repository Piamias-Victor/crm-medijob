import { z } from 'zod'
import type { DuplicateProbe } from '@/lib/candidate-duplicate-probe.types'

const probeEmailSchema = z.string().email()

export function isDuplicateProbeReady(probe: DuplicateProbe): boolean {
  const email = probe.email?.trim()
  if (email && probeEmailSchema.safeParse(email).success) return true
  return Boolean(probe.firstName.trim() && probe.lastName.trim() && probe.phone?.trim())
}

export function toDetectDuplicateInput(probe: DuplicateProbe) {
  const firstName = probe.firstName.trim()
  const lastName = probe.lastName.trim()
  return {
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    email: probe.email?.trim() || undefined,
    phone: probe.phone?.trim() || undefined,
  }
}

export type { DuplicateProbe } from '@/lib/candidate-duplicate-probe.types'
