import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'

export function makeContactRoleRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.ContactRoleCreateInput) => db.contactRole.create({ data }),
    findById: (id: string) => db.contactRole.findUnique({ where: { id } }),
    list: () => db.contactRole.findMany({ orderBy: { name: 'asc' } }),
    update: (id: string, data: Prisma.ContactRoleUpdateInput) =>
      db.contactRole.update({ where: { id }, data }),
    remove: (id: string) => db.contactRole.delete({ where: { id } }),
  }
}

export const contactRoleRepository = makeContactRoleRepository()
