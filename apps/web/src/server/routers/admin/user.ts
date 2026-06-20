import { TRPCError } from '@trpc/server'
import { router, adminProcedure } from '@/server/trpc'
import { userRepository } from '@/server/db/repositories/user.repository'
import { hashPassword } from '@/server/auth/password'
import {
  createUserSchema,
  updateUserSchema,
  normalizeUpdatePassword,
  type CreateUserInput,
  type UpdateUserInput,
} from '@/server/admin/user-schema'
import { idSchema } from '@/server/admin/schema'
import type { UserListItem } from '@/view-models/user-admin'

export type UserDeps = {
  list: () => Promise<UserListItem[]>
  create: (data: CreateUserInput & { password: string }) => Promise<UserListItem>
  update: (data: UpdateUserInput & { password?: string }) => Promise<UserListItem>
  remove: (id: string) => Promise<void>
  countAdmins: () => Promise<number>
  findById: (id: string) => Promise<{ id: string; role: UserListItem['role'] } | null>
  findByEmail: (email: string) => Promise<{ id: string } | null>
  hashPassword: (plain: string) => Promise<string>
}

async function assertUniqueEmail(
  deps: UserDeps,
  email: string,
  excludeId?: string,
): Promise<void> {
  const existing = await deps.findByEmail(email)
  if (existing && existing.id !== excludeId) {
    throw new TRPCError({ code: 'CONFLICT', message: 'Email déjà utilisé' })
  }
}

export function makeUserRouter(deps: UserDeps) {
  return router({
    list: adminProcedure.query(() => deps.list()),
    create: adminProcedure.input(createUserSchema).mutation(async ({ input }) => {
      await assertUniqueEmail(deps, input.email)
      const password = await deps.hashPassword(input.password)
      return deps.create({ ...input, password })
    }),
    update: adminProcedure.input(updateUserSchema).mutation(async ({ input }) => {
      const user = await deps.findById(input.id)
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' })
      if (
        user.role === 'ADMIN' &&
        input.role !== 'ADMIN' &&
        (await deps.countAdmins()) <= 1
      ) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Impossible de rétrograder le dernier administrateur',
        })
      }
      const plain = normalizeUpdatePassword(input.password)
      const password = plain ? await deps.hashPassword(plain) : undefined
      return deps.update({ ...input, password })
    }),
    remove: adminProcedure.input(idSchema).mutation(async ({ input }) => {
      const user = await deps.findById(input.id)
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' })
      if (user.role === 'ADMIN' && (await deps.countAdmins()) <= 1) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Impossible de supprimer le dernier administrateur',
        })
      }
      await deps.remove(input.id)
    }),
  })
}

export const userRouter = makeUserRouter({
  list: () => userRepository.list(),
  create: (data) => userRepository.create(data),
  update: (data) => userRepository.update(data),
  remove: (id) => userRepository.softDelete(id),
  countAdmins: () => userRepository.countAdmins(),
  findById: (id) => userRepository.findById(id),
  findByEmail: (email) => userRepository.findByEmailAny(email),
  hashPassword,
})
