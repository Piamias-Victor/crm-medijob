import { vi } from 'vitest'
import type { SmsDueDeps, SmsDueRow } from './sms-due.types'

export function smsDueRow(overrides: Partial<SmsDueRow> = {}): SmsDueRow {
  return {
    candidateId: 'c1',
    firstName: 'Marie',
    phone: '06 12 34 56 78',
    ...overrides,
  }
}

export function smsDueDeps(overrides: Partial<SmsDueDeps> = {}): SmsDueDeps {
  const row = smsDueRow()
  return {
    listDue: async () => [row],
    ensureUrl: vi.fn().mockResolvedValue('http://localhost:3000/dispo/secret-token'),
    sendSms: vi.fn(),
    markSent: vi.fn(),
    testTo: '06 99 99 99 99',
    ...overrides,
  }
}

export function memorySmsDue(rows: SmsDueRow[]): SmsDueDeps {
  const sent = new Set<string>()
  return smsDueDeps({
    listDue: async () => rows.filter((row) => !sent.has(row.candidateId)),
    markSent: vi.fn(async (id: string) => {
      sent.add(id)
    }),
  })
}
