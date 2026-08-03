import { vi } from 'vitest'

export function mockGlobalSearchRepos(overrides = {}) {
  return {
    pharmacy: { search: vi.fn().mockResolvedValue([]) },
    contact: { search: vi.fn().mockResolvedValue([]) },
    candidate: { search: vi.fn().mockResolvedValue([]) },
    mission: { search: vi.fn().mockResolvedValue([]) },
    ...overrides,
  }
}
