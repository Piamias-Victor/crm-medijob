import { vi } from 'vitest'
import type {
  ContractSignEmailDueDeps,
  ContractSignEmailDueRow,
} from './send-due.types'

export function contractSignEmailDueRow(
  overrides: Partial<ContractSignEmailDueRow> = {},
): ContractSignEmailDueRow {
  return {
    contractId: 'row1',
    pharmacyEmail: 'officine@example.com',
    primaryEmail: 'marie@example.com',
    primaryFirstName: 'Marie',
    ...overrides,
  }
}

export function contractSignEmailDueDeps(
  overrides: Partial<ContractSignEmailDueDeps> = {},
): ContractSignEmailDueDeps {
  return {
    listDue: async () => [contractSignEmailDueRow()],
    sendEmail: vi.fn(),
    markSent: vi.fn(),
    ...overrides,
  }
}

export function memoryContractSignEmailDue(
  rows: ContractSignEmailDueRow[],
): ContractSignEmailDueDeps {
  const sent = new Set<string>()
  return contractSignEmailDueDeps({
    listDue: async () => rows.filter((row) => !sent.has(row.contractId)),
    markSent: vi.fn(async (contractId) => {
      sent.add(contractId)
    }),
  })
}
