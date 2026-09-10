import { vi } from 'vitest'
import type { ContractSmsDueDeps, ContractSmsDueRow } from './send-due.types'

export function contractSmsDueRow(
  overrides: Partial<ContractSmsDueRow> = {},
): ContractSmsDueRow {
  return {
    contractId: 'row1',
    candidateId: 'c1',
    phone: '06 12 34 56 78',
    kind: 'first',
    ...overrides,
  }
}

export function contractSmsDueDeps(
  overrides: Partial<ContractSmsDueDeps> = {},
): ContractSmsDueDeps {
  return {
    listDue: async () => [contractSmsDueRow()],
    sendSms: vi.fn(),
    markSent: vi.fn(),
    logSend: vi.fn(),
    ...overrides,
  }
}

export function memoryContractSmsDue(rows: ContractSmsDueRow[]): ContractSmsDueDeps {
  const sent = new Set<string>()
  return contractSmsDueDeps({
    listDue: async () => rows.filter((row) => !sent.has(row.contractId)),
    markSent: vi.fn(async (id: string) => {
      sent.add(id)
    }),
  })
}
