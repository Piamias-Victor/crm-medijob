import type { PrismaClient, UserRole } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import type { UserListItem } from '@/view-models/user-admin'

const listSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const

export function makeUserRepository(db: PrismaClient = defaultDb) {
  return {
    findByEmail: (email: string) =>
      db.user.findFirst({ where: { email, ...NOT_DELETED } }),
    findByEmailAny: (email: string) =>
      db.user.findUnique({ where: { email }, select: { id: true } }),
    findById: (id: string) =>
      db.user.findFirst({
        where: { id, ...NOT_DELETED },
        select: { id: true, role: true },
      }),
    list: (): Promise<UserListItem[]> =>
      db.user.findMany({
        where: NOT_DELETED,
        select: listSelect,
        orderBy: { createdAt: 'desc' },
      }),
    create: (data: {
      name: string
      email: string
      password: string
      role: UserRole
    }) => db.user.create({ data, select: listSelect }),
    update: (input: {
      id: string
      name: string
      role: UserRole
      password?: string
    }) => {
      const { id, password, ...rest } = input
      return db.user.update({
        where: { id },
        data: password ? { ...rest, password } : rest,
        select: listSelect,
      })
    },
    softDelete: async (id: string) => {
      await db.user.update({ where: { id }, data: { deletedAt: new Date() } })
    },
    countAdmins: () =>
      db.user.count({ where: { role: 'ADMIN', ...NOT_DELETED } }),
  }
}

export const userRepository = makeUserRepository()
