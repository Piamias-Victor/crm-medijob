import { vi } from 'vitest'
import type { BadakanClient } from '@/server/badakan/client'

export function stubBadakanClient(
  overrides: Partial<BadakanClient> = {},
): BadakanClient {
  return {
    searchNewEmployees: vi.fn().mockResolvedValue([]),
    searchEmployees: vi.fn().mockResolvedValue([]),
    searchMissions: vi.fn().mockResolvedValue([]),
    searchContracts: vi.fn().mockResolvedValue([]),
    searchEnterprises: vi.fn().mockResolvedValue([]),
    getRecipient: vi.fn().mockResolvedValue(null),
    getComments: vi.fn().mockResolvedValue([]),
    getEnterprise: vi.fn().mockResolvedValue(null),
    ...overrides,
  }
}
