import { router, adminProcedure } from '@/server/trpc'
import { intakeStatusRepository } from '@/server/db/repositories/intake-status.repository'
import {
  intakeStatusAdminSchema,
  updateIntakeStatusAdminSchema,
  idSchema,
  reorderSchema,
} from '@/server/admin/schema'
import { toPositionUpdates } from '@/server/admin/reorder'

export type IntakeStatusRow = {
  id: string
  name: string
  color: string
  position: number
  archivedAt: Date | null
}

export type IntakeStatusAdminDeps = {
  list: () => Promise<IntakeStatusRow[]>
  create: (
    input: { name: string; color: string },
    position: number,
  ) => Promise<IntakeStatusRow>
  update: (id: string, input: { name: string; color: string }) => Promise<IntakeStatusRow>
  removeOrArchive: (id: string) => Promise<{ action: 'deleted' | 'archived' }>
  reorder: (orderedIds: string[]) => Promise<unknown>
}

export function makeIntakeStatusAdminRouter(deps: IntakeStatusAdminDeps) {
  return router({
    list: adminProcedure.query(() => deps.list()),
    create: adminProcedure.input(intakeStatusAdminSchema).mutation(async ({ input }) => {
      const rows = await deps.list()
      return deps.create(input, rows.length)
    }),
    update: adminProcedure
      .input(updateIntakeStatusAdminSchema)
      .mutation(({ input }) => deps.update(input.id, { name: input.name, color: input.color })),
    remove: adminProcedure.input(idSchema).mutation(({ input }) => deps.removeOrArchive(input.id)),
    reorder: adminProcedure
      .input(reorderSchema)
      .mutation(({ input }) => deps.reorder(input.orderedIds)),
  })
}

export const intakeStatusAdminRouter = makeIntakeStatusAdminRouter({
  list: () => intakeStatusRepository.list(),
  create: (input, position) =>
    intakeStatusRepository.create({
      name: input.name,
      color: input.color,
      position,
    }),
  update: (id, input) =>
    intakeStatusRepository.update(id, { name: input.name, color: input.color }),
  removeOrArchive: (id) => intakeStatusRepository.removeOrArchive(id),
  reorder: (orderedIds) => intakeStatusRepository.reorder(toPositionUpdates(orderedIds)),
})
