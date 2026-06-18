// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'
import { hashPassword, verifyPassword } from './password'
import { authorizeCredentials } from './authorize'
import { evaluateAccess } from './access'

type Row = { id: string; email: string; name: string; password: string; role: 'RECRUTEUR' | 'ADMIN'; deletedAt: Date | null }

const rows: Row[] = []

const fakeRepo = {
  findByEmail: async (email: string) =>
    rows.find((r) => r.email === email && r.deletedAt === null) ?? null,
}

beforeAll(async () => {
  rows.push(
    { id: 'a', email: 'admin@medijob.fr', name: 'Admin', password: await hashPassword('admin-pw'), role: 'ADMIN', deletedAt: null },
    { id: 'r', email: 'recruteur@medijob.fr', name: 'Recruteur', password: await hashPassword('recruteur-pw'), role: 'RECRUTEUR', deletedAt: null },
    { id: 'x', email: 'gone@medijob.fr', name: 'Gone', password: await hashPassword('gone-pw'), role: 'RECRUTEUR', deletedAt: new Date() },
  )
})

const deps = { findByEmail: fakeRepo.findByEmail, verify: verifyPassword }

describe('login + role gate', () => {
  it('admin logs in and reaches admin routes', async () => {
    const user = await authorizeCredentials({ email: 'admin@medijob.fr', password: 'admin-pw' }, deps)
    expect(user?.role).toBe('ADMIN')
    expect(evaluateAccess({ loggedIn: true, role: user!.role, pathname: '/admin' })).toBe('allow')
  })

  it('recruiter logs in but is blocked from admin routes', async () => {
    const user = await authorizeCredentials({ email: 'recruteur@medijob.fr', password: 'recruteur-pw' }, deps)
    expect(user?.role).toBe('RECRUTEUR')
    expect(evaluateAccess({ loggedIn: true, role: user!.role, pathname: '/admin' })).toBe('forbid-admin')
    expect(evaluateAccess({ loggedIn: true, role: user!.role, pathname: '/candidats' })).toBe('allow')
  })

  it('wrong password is refused', async () => {
    expect(await authorizeCredentials({ email: 'admin@medijob.fr', password: 'nope' }, deps)).toBeNull()
  })

  it('soft-deleted user cannot log in', async () => {
    expect(await authorizeCredentials({ email: 'gone@medijob.fr', password: 'gone-pw' }, deps)).toBeNull()
  })
})
