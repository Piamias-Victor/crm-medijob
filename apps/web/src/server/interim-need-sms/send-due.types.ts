import type { SmsInput } from '@/server/sms/send'
import type { GeoLookup } from '@/server/matching/distance'
import type { NeedSmsNeed, NeedSmsRow } from './match.types'

export type InterimNeedSmsResult = {
  sent: number
  skippedNoPhone: number
  skippedInit: number
  failed: number
  lastError?: string
}

export type InterimNeedSmsDeps = {
  listCandidates: () => Promise<NeedSmsRow[]>
  listOpenNeeds: () => Promise<NeedSmsNeed[]>
  sendSms: (input: SmsInput) => Promise<void>
  markSent: (candidateId: string) => Promise<unknown>
  lookupGeo: GeoLookup
  testTo?: string
}
