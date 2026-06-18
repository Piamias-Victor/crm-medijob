import { verifyPassword } from './password'
import { userRepository } from '@/server/db/repositories/user.repository'
import type { LoginInput } from './schema'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'RECRUTEUR' | 'ADMIN'
}

type StoredUser = AuthUser & { password: string }

interface AuthorizeDeps {
  findByEmail: (email: string) => Promise<StoredUser | null>
  verify: typeof verifyPassword
}

const defaultDeps: AuthorizeDeps = {
  findByEmail: userRepository.findByEmail,
  verify: verifyPassword,
}

export async function authorizeCredentials(
  input: LoginInput,
  deps: AuthorizeDeps = defaultDeps,
): Promise<AuthUser | null> {
  const user = await deps.findByEmail(input.email)
  if (!user) return null

  const valid = await deps.verify(user.password, input.password)
  if (!valid) return null

  return { id: user.id, email: user.email, name: user.name, role: user.role }
}
