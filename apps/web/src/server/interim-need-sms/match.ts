import { INTERIM_NEED_SMS_RADIUS_KM } from '@/view-models/interim-need-sms'
import { needStartsInFuture } from '@/view-models/interim-need-sms-start'
import { haversineKm, type GeoLookup } from '@/server/matching/distance'
import type { NeedSmsCandidate, NeedSmsNeed } from './match.types'

type GeoRow = {
  latitude: number | null
  longitude: number | null
  postalCode: string | null
}

export async function coordsForSms(row: GeoRow, lookupGeo: GeoLookup) {
  if (row.latitude != null && row.longitude != null) {
    return { lat: row.latitude, lon: row.longitude }
  }
  const code = row.postalCode?.trim()
  if (!code) return null
  return lookupGeo(code)
}

async function isNewMatch(
  candidate: NeedSmsCandidate,
  need: NeedSmsNeed,
  lookupGeo: GeoLookup,
  now: Date,
) {
  if (need.jobTitleId !== candidate.jobTitleId) return false
  if (!needStartsInFuture(need.startsAt, now)) return false
  if (candidate.lastSentAt && need.createdAt <= candidate.lastSentAt) return false
  const from = await coordsForSms(candidate, lookupGeo)
  const to = await coordsForSms(need, lookupGeo)
  if (!from || !to) return false
  return haversineKm(from, to) <= INTERIM_NEED_SMS_RADIUS_KM
}

export async function hasMatchingNewNeed(
  candidate: NeedSmsCandidate,
  needs: NeedSmsNeed[],
  lookupGeo: GeoLookup,
  now = new Date(),
) {
  for (const need of needs) {
    if (await isNewMatch(candidate, need, lookupGeo, now)) return true
  }
  return false
}
