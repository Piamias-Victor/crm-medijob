import type { HireflixInviteInput, HireflixInviteResult } from '@/server/app-profile/invite-due.types'
import { fetchExistingHireflixInterview } from './invite-existing'
import { HIREFLIX_INVITE_MUTATION } from './invite-query'
import { hireflixInviteDataSchema } from './invite.schema'

export type HireflixEnv = {
  HIREFLIX_API_KEY?: string
  HIREFLIX_POSITION_ID?: string
}

export type InviteHireflixDeps = {
  fetchFn?: typeof fetch
  env?: HireflixEnv
}

function hireflixConfig(env: HireflixEnv) {
  const apiKey = env.HIREFLIX_API_KEY?.trim()
  const positionId = env.HIREFLIX_POSITION_ID?.trim()
  if (!apiKey || !positionId) throw new Error('Hireflix indisponible')
  return { apiKey, positionId }
}

export async function inviteHireflixCandidate(
  input: HireflixInviteInput,
  deps: InviteHireflixDeps = {},
): Promise<HireflixInviteResult> {
  const { apiKey, positionId } = hireflixConfig({
    HIREFLIX_API_KEY: deps.env?.HIREFLIX_API_KEY ?? process.env.HIREFLIX_API_KEY,
    HIREFLIX_POSITION_ID: deps.env?.HIREFLIX_POSITION_ID ?? process.env.HIREFLIX_POSITION_ID,
  })
  const fetchFn = deps.fetchFn ?? fetch
  const res = await fetchFn('https://api.hireflix.com/me', {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
    body: JSON.stringify({
      query: HIREFLIX_INVITE_MUTATION,
      variables: {
        input: {
          candidate: {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
          },
          positionId,
          externalId: input.externalId,
          disableNotifications: true,
        },
      },
    }),
  })
  if (!res.ok) throw new Error('Hireflix indisponible')
  const parsed = hireflixInviteDataSchema.safeParse(await res.json())
  if (!parsed.success) throw new Error('Hireflix indisponible')
  const node = parsed.data.data.inviteCandidateToInterview
  if (node.__typename === 'InterviewType') {
    return { interviewId: node.id, url: node.url.public }
  }
  if (node.__typename === 'InterviewAlreadyExistsInPositionError') {
    return fetchExistingHireflixInterview(
      { apiKey, positionId, email: input.email },
      fetchFn,
    )
  }
  throw new Error(node.message ?? 'Hireflix indisponible')
}
