import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import {
  AUTOMATIC_AUTHOR_EMAIL,
  AUTOMATIC_AUTHOR_NAME,
} from '@/view-models/automatic-outbound'

const authorSelect = { id: true, deletedAt: true } as const

export function makeAutomaticAuthorRepository(db: PrismaClient = defaultDb) {
  return {
    ensure: async (createPassword: () => Promise<string>) => {
      const existing = await db.user.findUnique({
        where: { email: AUTOMATIC_AUTHOR_EMAIL },
        select: authorSelect,
      })
      if (existing) {
        if (existing.deletedAt) {
          await db.user.update({
            where: { id: existing.id },
            data: { deletedAt: null, name: AUTOMATIC_AUTHOR_NAME },
          })
        }
        return { id: existing.id }
      }
      return db.user.create({
        data: {
          email: AUTOMATIC_AUTHOR_EMAIL,
          name: AUTOMATIC_AUTHOR_NAME,
          password: await createPassword(),
          role: 'COMMUNICATION',
        },
        select: { id: true },
      })
    },
  }
}

export const automaticAuthorRepository = makeAutomaticAuthorRepository()
