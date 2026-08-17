import { describe, expect, it } from 'vitest'
import { interviewCaller, makeInterviewDeps, recruiterSession } from '@/server/routers/interview.test.fixtures'
import type { UserRole } from '@/server/auth/permissions'

const directionSession = {
  user: { id: 'u-dir', role: 'DIRECTION' as UserRole },
  expires: '2999-01-01',
}

describe('interviewRouter softDelete', () => {
  it('lets Direction soft-delete a CLOSED interview', async () => {
    const deps = makeInterviewDeps()
    const result = await interviewCaller(deps, directionSession).softDelete({ id: 'i1' })
    expect(result).toEqual({ candidateId: 'c1' })
    expect(deps.softDeleteInterview).toHaveBeenCalledWith('i1')
  })

  it('forbids Recruteur from soft-deleting', async () => {
    await expect(
      interviewCaller(makeInterviewDeps(), recruiterSession).softDelete({ id: 'i1' }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})
