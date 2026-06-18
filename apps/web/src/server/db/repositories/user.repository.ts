import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

export function makeUserRepository(db: PrismaClient = defaultDb) {
  return {
    findByEmail: (email: string) =>
      db.user.findFirst({ where: { email, ...NOT_DELETED } }),
    findById: (id: string) =>
      db.user.findFirst({ where: { id, ...NOT_DELETED } }),
  }
}

export const userRepository = makeUserRepository()
