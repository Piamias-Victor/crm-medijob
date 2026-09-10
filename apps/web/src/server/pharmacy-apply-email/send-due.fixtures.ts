import { vi } from 'vitest'
import type {
  PharmacyApplyEmailDueDeps,
  PharmacyApplyEmailDueRow,
} from './send-due.types'

export function pharmacyApplyDueRow(
  overrides: Partial<PharmacyApplyEmailDueRow> = {},
): PharmacyApplyEmailDueRow {
  return {
    missionBadakanId: 'm-hermes',
    recipientId: 'rec-1',
    pharmacyEmail: 'officine@example.com',
    primaryEmail: 'marie@example.com',
    primaryFirstName: 'Marie',
    ...overrides,
  }
}

export function pharmacyApplyDueDeps(
  overrides: Partial<PharmacyApplyEmailDueDeps> = {},
): PharmacyApplyEmailDueDeps {
  return {
    listDue: async () => [pharmacyApplyDueRow()],
    sendEmail: vi.fn(),
    markSent: vi.fn(),
    ...overrides,
  }
}

export function memoryPharmacyApplyDue(
  rows: PharmacyApplyEmailDueRow[],
): PharmacyApplyEmailDueDeps {
  const sent = new Set<string>()
  const key = (missionBadakanId: string, recipientId: string) =>
    `${missionBadakanId}:${recipientId}`
  return pharmacyApplyDueDeps({
    listDue: async () =>
      rows.filter((row) => !sent.has(key(row.missionBadakanId, row.recipientId))),
    markSent: vi.fn(async (missionBadakanId, recipientId) => {
      sent.add(key(missionBadakanId, recipientId))
    }),
  })
}
