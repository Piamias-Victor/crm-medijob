import { TRPCError } from '@trpc/server'
import { router, adminProcedure } from '@/server/trpc'
import { can } from '@/server/auth/permissions'
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
  findById: (
    id: string,
  ) => Promise<{ id: string; role: UserListItem['role']; email: string } | null>
  findByEmail: (email: string) => Promise<{ id: string } | null>
  hashPassword: (plain: string) => Promise<string>
  createInvitePlaceholder: () => string
  sendInvite: (email: string) => Promise<void>
}

async function assertUniqueEmail(deps: UserDeps, email: string, excludeId?: string) {
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
      const password = await deps.hashPassword(deps.createInvitePlaceholder())
      const user = await deps.create({ ...input, password })
      await deps.sendInvite(input.email)
      return user
    }),
    resendInvite: adminProcedure.input(idSchema).mutation(async ({ input }) => {
      const user = await deps.findById(input.id)
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' })
      await deps.sendInvite(user.email)
      return { ok: true as const }
    }),
    update: adminProcedure.input(updateUserSchema).mutation(async ({ input }) => {
      const user = await deps.findById(input.id)
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' })
      if (
        can(user.role, 'admin') &&
        !can(input.role, 'admin') &&
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
      if (can(user.role, 'admin') && (await deps.countAdmins()) <= 1) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Impossible de supprimer le dernier administrateur',
        })
      }
      await deps.remove(input.id)
    }),
  })
}
