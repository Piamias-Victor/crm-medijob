import { describe, expect, it, vi } from 'vitest'
import { testBadakanClient } from './client-test-client'

// Badakan validates order.parameter against a per-endpoint enum: an unknown value makes it
// reject the whole body with a 400 « corps illisible ».
function fetchSpy() {
  return vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ securityToken: 'tok' }) })
    .mockResolvedValue({ ok: true, json: async () => ({ content: [], totalPages: 1 }) })
}

function sentOrder(fetchFn: ReturnType<typeof fetchSpy>) {
  const init = fetchFn.mock.calls[1]?.[1] as RequestInit
  return JSON.parse(String(init.body)).order
}

describe('createBadakanClient search ordering', () => {
  it('orders missions by their only accepted parameter', async () => {
    const fetchFn = fetchSpy()
    await testBadakanClient(fetchFn).searchMissions(5)
    expect(sentOrder(fetchFn)).toEqual({ descending: true, parameter: 'EXPECTED_START_DATE' })
  })

  it('orders contracts by their only accepted parameter', async () => {
    const fetchFn = fetchSpy()
    await testBadakanClient(fetchFn).searchContracts(5)
    expect(sentOrder(fetchFn)).toEqual({ descending: true, parameter: 'START_DATE' })
  })

  it('keeps recipients on creation date', async () => {
    const fetchFn = fetchSpy()
    await testBadakanClient(fetchFn).searchEmployees(5)
    expect(sentOrder(fetchFn)).toEqual({ descending: true, parameter: 'CREATION_DATE' })
  })

  it('keeps new recipients on creation date', async () => {
    const fetchFn = fetchSpy()
    await testBadakanClient(fetchFn).searchNewEmployees(5)
    expect(sentOrder(fetchFn)).toEqual({ descending: true, parameter: 'CREATION_DATE' })
  })
})
