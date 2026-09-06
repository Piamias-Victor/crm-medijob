// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { adminCaller, makeUserDeps } from '@/server/routers/admin/user.test.fixtures'

describe('userRouter invite', () => {
  it('creates a user and sends an invite email without admin password', async () => {
    const deps = makeUserDeps()
    await adminCaller(deps).create({
      name: 'Jane Doe',
      email: 'jane@medijob.fr',
      role: 'RECRUTEUR',
    })
    expect(deps.createInvitePlaceholder).toHaveBeenCalled()
    expect(deps.hashPassword).toHaveBeenCalledWith('invite-placeholder')
    expect(deps.create).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@medijob.fr',
      password: '$argon2id$hash',
      role: 'RECRUTEUR',
    })
    expect(deps.sendInvite).toHaveBeenCalledWith('jane@medijob.fr')
  })

  it('resends the invite email for an existing user', async () => {
    const deps = makeUserDeps()
    await adminCaller(deps).resendInvite({ id: 'u3' })
    expect(deps.sendInvite).toHaveBeenCalledWith('jane@medijob.fr')
  })

  it('rejects duplicate email on create', async () => {
    const deps = makeUserDeps({
      findByEmail: vi.fn().mockResolvedValue({ id: 'other', email: 'jane@medijob.fr' }),
    })
    await expect(
      adminCaller(deps).create({
        name: 'Jane',
        email: 'jane@medijob.fr',
        role: 'RECRUTEUR',
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })
})
