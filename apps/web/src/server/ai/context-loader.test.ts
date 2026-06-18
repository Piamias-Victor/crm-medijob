// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { loadContextText } from './context-loader'

function repos(overrides = {}) {
  return {
    candidate: { findById: vi.fn().mockResolvedValue(null) },
    pharmacy: { findById: vi.fn().mockResolvedValue(null) },
    mission: { findById: vi.fn().mockResolvedValue(null) },
    ...overrides,
  }
}

describe('loadContextText', () => {
  it('returns null when no context is provided', async () => {
    expect(await loadContextText(undefined, repos())).toBeNull()
  })

  it('returns null when entityType is set but entityId is missing', async () => {
    expect(await loadContextText({ entityType: 'candidate' }, repos())).toBeNull()
  })

  it('loads and formats a candidate', async () => {
    const deps = repos({
      candidate: {
        findById: vi.fn().mockResolvedValue({ firstName: 'Marie', lastName: 'Curie' }),
      },
    })
    const text = await loadContextText({ entityType: 'candidate', entityId: 'c1' }, deps)
    expect(deps.candidate.findById).toHaveBeenCalledWith('c1')
    expect(text).toContain('Marie Curie')
  })

  it('returns null when the entity is not found', async () => {
    const text = await loadContextText({ entityType: 'mission', entityId: 'x' }, repos())
    expect(text).toBeNull()
  })
})
