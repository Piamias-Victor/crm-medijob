// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeUserRouter } from '@/server/routers/admin/user'
import {
  adminSession,
  recruteurSession,
  sampleUser,
  makeUserDeps,
} from '@/server/routers/admin/user.test.fixtures'

function adminCaller(deps: ReturnType<typeof makeUserDeps>) {
  return createCallerFactory(makeUserRouter(deps))({ session: adminSession })
}

describe('userRouter', () => {
  it('returns active users without password hash', async () => {
    const list = await adminCaller(makeUserDeps()).list()
    expect(list[0]).toEqual(sampleUser)
    expect(list[0]).not.toHaveProperty('password')
  })

  it('creates a user with a hashed password', async () => {
    const deps = makeUserDeps()
    await adminCaller(deps).create({
      name: 'Jane Doe',
      email: 'jane@medijob.fr',
      password: 'secret-pw',
      role: 'RECRUTEUR',
    })
    expect(deps.hashPassword).toHaveBeenCalledWith('secret-pw')
    expect(deps.create).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@medijob.fr',
      password: '$argon2id$hash',
      role: 'RECRUTEUR',
    })
  })

  it('updates name and role without password when omitted', async () => {
    const deps = makeUserDeps()
    await adminCaller(deps).update({ id: 'u3', name: 'Jane Updated', role: 'ADMIN' })
    expect(deps.hashPassword).not.toHaveBeenCalled()
    expect(deps.update).toHaveBeenCalledWith({
      id: 'u3',
      name: 'Jane Updated',
      role: 'ADMIN',
      password: undefined,
    })
  })

  it('soft-deletes a user', async () => {
    const deps = makeUserDeps()
    await adminCaller(deps).remove({ id: 'u3' })
    expect(deps.remove).toHaveBeenCalledWith('u3')
  })

  it('refuses to remove the last ADMIN', async () => {
    const deps = makeUserDeps({
      findById: vi.fn().mockResolvedValue({ ...sampleUser, role: 'ADMIN' }),
      countAdmins: vi.fn().mockResolvedValue(1),
    })
    await expect(adminCaller(deps).remove({ id: 'u3' })).rejects.toMatchObject({
      code: 'CONFLICT',
    })
  })

  it('rejects duplicate email on create', async () => {
    const deps = makeUserDeps({
      findByEmail: vi.fn().mockResolvedValue({ id: 'other', email: 'jane@medijob.fr' }),
    })
    await expect(
      adminCaller(deps).create({
        name: 'Jane',
        email: 'jane@medijob.fr',
        password: 'secret-pw',
        role: 'RECRUTEUR',
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })

  it('forbids RECRUTEUR callers', async () => {
    const caller = createCallerFactory(makeUserRouter(makeUserDeps()))({ session: recruteurSession })
    await expect(caller.list()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})
