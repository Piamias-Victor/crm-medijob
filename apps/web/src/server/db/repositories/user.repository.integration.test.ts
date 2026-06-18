// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { startTestDb, type TestDb } from '../../../../test/db'
import { makeUserRepository } from './user.repository'

let db: TestDb
let repo: ReturnType<typeof makeUserRepository>

beforeAll(async () => {
  db = await startTestDb()
  repo = makeUserRepository(db.prisma)
}, 120_000)

afterAll(async () => {
  await db?.stop()
})

describe('userRepository', () => {
  it('finds an active user by email', async () => {
    await db.prisma.user.create({
      data: { email: 'active@medijob.fr', password: 'hash', name: 'Active' },
    })
    const found = await repo.findByEmail('active@medijob.fr')
    expect(found?.name).toBe('Active')
  })

  it('ignores soft-deleted users on email lookup', async () => {
    await db.prisma.user.create({
      data: {
        email: 'gone@medijob.fr',
        password: 'hash',
        name: 'Gone',
        deletedAt: new Date(),
      },
    })
    expect(await repo.findByEmail('gone@medijob.fr')).toBeNull()
  })

  it('lists active users without password', async () => {
    await db.prisma.user.create({
      data: { email: 'list@medijob.fr', password: 'hash', name: 'Listed' },
    })
    const users = await repo.list()
    const row = users.find((u) => u.email === 'list@medijob.fr')
    expect(row?.name).toBe('Listed')
    expect(row).not.toHaveProperty('password')
  })

  it('soft-deletes a user', async () => {
    const user = await db.prisma.user.create({
      data: { email: 'del@medijob.fr', password: 'hash', name: 'Delete Me' },
    })
    await repo.softDelete(user.id)
    expect(await repo.findByEmail('del@medijob.fr')).toBeNull()
  })

  it('lists recruiters and admins for referent pickers', async () => {
    await db.prisma.user.create({
      data: { email: 'rec@medijob.fr', password: 'hash', name: 'Rec', role: 'RECRUTEUR' },
    })
    await db.prisma.user.create({
      data: { email: 'adm2@medijob.fr', password: 'hash', name: 'Admin2', role: 'ADMIN' },
    })
    const recruiters = await repo.listRecruiters()
    expect(recruiters.some((u) => u.name === 'Rec')).toBe(true)
    expect(recruiters.some((u) => u.name === 'Admin2')).toBe(true)
  })

  it('counts active admins', async () => {
    await db.prisma.user.create({
      data: { email: 'adm@medijob.fr', password: 'hash', name: 'Admin', role: 'ADMIN' },
    })
    expect(await repo.countAdmins()).toBeGreaterThanOrEqual(1)
  })
})
