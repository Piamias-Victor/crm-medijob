import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'
import type { PositionUpdate } from '@/server/admin/reorder'

export type IntakeStatusRemoveResult = { action: 'deleted' | 'archived' }

export function makeIntakeStatusRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.IntakeStatusCreateInput) => db.intakeStatus.create({ data }),
    findById: (id: string) => db.intakeStatus.findUnique({ where: { id } }),
    list: () => db.intakeStatus.findMany({ orderBy: { position: 'asc' } }),
    listActive: () =>
      db.intakeStatus.findMany({
        where: { archivedAt: null },
        orderBy: { position: 'asc' },
      }),
    update: (id: string, data: Prisma.IntakeStatusUpdateInput) =>
      db.intakeStatus.update({ where: { id }, data }),
    usageCount: (id: string) => db.appProfile.count({ where: { intakeStatusId: id } }),
    removeOrArchive: async (id: string): Promise<IntakeStatusRemoveResult> => {
      const usage = await db.appProfile.count({ where: { intakeStatusId: id } })
      if (usage > 0) {
        await db.intakeStatus.update({
          where: { id },
          data: { archivedAt: new Date() },
        })
        return { action: 'archived' }
      }
      await db.intakeStatus.delete({ where: { id } })
      return { action: 'deleted' }
    },
    reorder: (updates: PositionUpdate[]) =>
      db.$transaction(
        updates.map((u) =>
          db.intakeStatus.update({
            where: { id: u.id },
            data: { position: u.position },
          }),
        ),
      ),
  }
}

export const intakeStatusRepository = makeIntakeStatusRepository()
