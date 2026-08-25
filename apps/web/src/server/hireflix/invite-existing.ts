import type { HireflixInviteResult } from '@/server/app-profile/invite-due.types'
import { HIREFLIX_EXISTING_QUERY } from './invite-query'
import { hireflixExistingSchema } from './invite.schema'

export async function fetchExistingHireflixInterview(
  input: { positionId: string; email: string; apiKey: string },
  fetchFn: typeof fetch,
): Promise<HireflixInviteResult> {
  const res = await fetchFn('https://api.hireflix.com/me', {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': input.apiKey },
    body: JSON.stringify({
      query: HIREFLIX_EXISTING_QUERY,
      variables: { positionId: input.positionId, email: input.email },
    }),
  })
  if (!res.ok) throw new Error('Hireflix indisponible')
  const parsed = hireflixExistingSchema.safeParse(await res.json())
  if (!parsed.success) throw new Error('Hireflix indisponible')
  const row = parsed.data.data.position.interviewList.results[0]
  if (!row) throw new Error('Hireflix indisponible')
  return { interviewId: row.id, url: row.url.public }
}
