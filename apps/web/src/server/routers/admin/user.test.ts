// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeUserRouter } from '@/server/routers/admin/user'
import {
  recruteurSession,
  sampleUser,
  makeUserDeps,
  adminCaller,
} from '@/server/routers/admin/user.test.fixtures'

describe('userRouter', () => {
  it('returns active users without password hash', async () => {
    const list = await adminCaller(makeUserDeps()).list()
    expect(list[0]).toEqual(sampleUser)
    expect(list[0]).not.toHaveProperty('password')
  })

  it('updates name and role without password when omitted', async () => {
    const deps = makeUserDeps()
    await adminCaller(deps).update({ id: 'u3', name: 'Jane Updated', role: 'RH_ADMIN' })
    expect(deps.hashPassword).not.toHaveBeenCalled()
    expect(deps.update).toHaveBeenCalledWith({
      id: 'u3',
      name: 'Jane Updated',
      role: 'RH_ADMIN',
      password: undefined,
    })
  })

  it('soft-deletes a user', async () => {
    const deps = makeUserDeps()
    await adminCaller(deps).remove({ id: 'u3' })
    expect(deps.remove).toHaveBeenCalledWith('u3')
  })

  it('refuses to remove the last admin-capable user', async () => {
    const deps = makeUserDeps({
      findById: vi.fn().mockResolvedValue({ ...sampleUser, role: 'RH_ADMIN' }),
      countAdmins: vi.fn().mockResolvedValue(1),
    })
    await expect(adminCaller(deps).remove({ id: 'u3' })).rejects.toMatchObject({
      code: 'CONFLICT',
    })
  })

  it('refuse de rétrograder le dernier administrateur', async () => {
    const deps = makeUserDeps({
      findById: vi.fn().mockResolvedValue({ id: 'a1', role: 'DIRECTION', email: 'a@m.fr' }),
      countAdmins: vi.fn().mockResolvedValue(1),
    })
    await expect(
      adminCaller(deps).update({ id: 'a1', name: 'Admin', role: 'RECRUTEUR' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
    expect(deps.update).not.toHaveBeenCalled()
  })

  it('forbids RECRUTEUR callers', async () => {
    const caller = createCallerFactory(makeUserRouter(makeUserDeps()))({
      session: recruteurSession,
    })
    await expect(caller.list()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})
