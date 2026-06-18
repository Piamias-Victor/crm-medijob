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
})
