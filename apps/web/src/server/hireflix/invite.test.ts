import { describe, expect, it, vi } from 'vitest'
import { inviteHireflixCandidate } from './invite'

const env = {
  HIREFLIX_API_KEY: 'hf-key',
  HIREFLIX_POSITION_ID: 'pos-1',
}

const input = {
  firstName: 'Camille',
  lastName: 'Dupont',
  email: 'camille@example.com',
  externalId: 'p1',
}

describe('inviteHireflixCandidate', () => {
  it('returns the candidate URL and disables Hireflix mail', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          inviteCandidateToInterview: {
            __typename: 'InterviewType',
            id: 'hf1',
            url: { public: 'https://app.hireflix.com/abc' },
          },
        },
      }),
    })
    const result = await inviteHireflixCandidate(input, { fetchFn, env })
    expect(result).toEqual({
      interviewId: 'hf1',
      url: 'https://app.hireflix.com/abc',
    })
    const [, init] = fetchFn.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(String(init.body)) as { query: string; variables: { input: { disableNotifications: boolean } } }
    expect(body.variables.input.disableNotifications).toBe(true)
    expect(init.headers).toMatchObject({ 'X-API-KEY': 'hf-key' })
  })

  it('fails closed when Hireflix env is missing', async () => {
    const fetchFn = vi.fn()
    await expect(inviteHireflixCandidate(input, { fetchFn, env: {} })).rejects.toThrow(
      'Hireflix indisponible',
    )
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('reuses the existing interview URL when the candidate is already invited', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            inviteCandidateToInterview: {
              __typename: 'InterviewAlreadyExistsInPositionError',
              code: 409,
              message: 'exists',
            },
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            position: {
              interviewList: {
                results: [
                  {
                    id: 'hf-old',
                    url: { public: 'https://app.hireflix.com/old' },
                  },
                ],
              },
            },
          },
        }),
      })
    await expect(inviteHireflixCandidate(input, { fetchFn, env })).resolves.toEqual({
      interviewId: 'hf-old',
      url: 'https://app.hireflix.com/old',
    })
  })
})

