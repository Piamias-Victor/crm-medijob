import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

export function makeVerificationTokenRepository(db: PrismaClient = defaultDb) {
  return {
    findByToken: (token: string) =>
      db.verificationToken.findFirst({ where: { token } }),
    create: (data: { identifier: string; token: string; expires: Date }) =>
      db.verificationToken.create({ data }),
    delete: (data: { identifier: string; token: string }) =>
      db.verificationToken.delete({
        where: { identifier_token: data },
      }),
    deleteAllForIdentifier: (identifier: string) =>
      db.verificationToken.deleteMany({ where: { identifier } }),
  }
}

export const verificationTokenRepository = makeVerificationTokenRepository()
