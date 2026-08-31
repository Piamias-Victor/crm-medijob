import type { WeekDeclaration } from './week-declaration'

export type { WeekDeclaration } from './week-declaration'

export type AmPm = 'AM' | 'PM'

export type AvailabilitySlot = {
  date: string
  period: AmPm
}

export type WeekView = {
  weekStart: string
  declaration: WeekDeclaration
  slots: AvailabilitySlot[]
}

export type GetWeekResult =
  | { ok: true; week: WeekView }
  | { ok: false; reason: 'not_found' }

export type WeeklyAvailabilityStore = {
  findCandidateByToken: (token: string) => Promise<{ candidateId: string } | null>
  findWeek: (
    candidateId: string,
    weekStart: string,
  ) => Promise<{ slots: AvailabilitySlot[] } | null>
  upsertWeek: (
    candidateId: string,
    weekStart: string,
    slots: AvailabilitySlot[],
  ) => Promise<void>
  findOrigin: (candidateId: string) => Promise<'APP' | 'CRM' | null>
  findTokenByCandidate: (candidateId: string) => Promise<string | null>
  insertToken: (candidateId: string, token: string) => Promise<void>
}

export type GetWeekInput = {
  token: string
  weekStart?: string
  now?: Date
}
