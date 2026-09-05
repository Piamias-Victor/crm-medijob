import { describe, expect, it } from 'vitest'
import { ensureLink } from './ensure-link'
import { memoryAvailabilityStore } from './test-store'

const createToken = () => 'unguessable-token-32bytes-base64url'

describe('ensureLink', () => {
  it('creates a copyable public path for an App-origin Candidate', async () => {
    const store = memoryAvailabilityStore([{ candidateId: 'c1', origin: 'APP' }])
    const result = await ensureLink(store, { candidateId: 'c1', createToken })
    expect(result).toEqual({
      ok: true,
      path: '/dispo/unguessable-token-32bytes-base64url',
      token: 'unguessable-token-32bytes-base64url',
    })
  })

  it('returns no path for a CRM-origin Candidate', async () => {
    const store = memoryAvailabilityStore([{ candidateId: 'c1', origin: 'CRM' }])
    const result = await ensureLink(store, { candidateId: 'c1', createToken })
    expect(result).toEqual({ ok: false, reason: 'not_app_origin' })
  })
})
