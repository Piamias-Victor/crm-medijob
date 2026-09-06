import { userRepository } from '@/server/db/repositories/user.repository'
import { hashPassword } from '@/server/auth/password'
import { createRawToken } from '@/server/auth/hash-token'
import { sendAccessInvite } from '@/server/auth/invite-access'
import { makeDefaultInviteAccessDeps } from '@/server/auth/invite-access.deps'
import { makeUserRouter, type UserDeps } from '@/server/routers/admin/user'

export const liveUserDeps: UserDeps = {
  list: () => userRepository.list(),
  create: (data) => userRepository.create(data),
  update: (data) => userRepository.update(data),
  remove: (id) => userRepository.softDelete(id),
  countAdmins: () => userRepository.countAdmins(),
  findById: (id) => userRepository.findById(id),
  findByEmail: (email) => userRepository.findByEmailAny(email),
  hashPassword,
  createInvitePlaceholder: createRawToken,
  sendInvite: (email) => sendAccessInvite(email, makeDefaultInviteAccessDeps()),
}

export const userRouter = makeUserRouter(liveUserDeps)
