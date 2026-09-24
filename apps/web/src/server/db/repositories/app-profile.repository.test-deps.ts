import { vi } from 'vitest'

export function mockAppProfileDb() {
  return {
    appProfile: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
  }
}
