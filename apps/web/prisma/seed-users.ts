import { PrismaClient, UserRole } from '@prisma/client'
import { hashPassword } from '../src/server/auth/password'
import {
  DEFAULT_TESTER_EMAIL,
  DEFAULT_TESTER_NAME,
  DEFAULT_TESTER_PASSWORD,
} from '../src/server/auth/dev-tester'

type SeedUserDef = {
  email: string
  name: string
  role: UserRole
  /** Env keys tried in order (first non-empty wins). */
  envKeys: readonly string[]
  fallback: string
}

const CORE_SEED_USERS: readonly SeedUserDef[] = [
  {
    email: 'direction@medijob.fr',
    name: 'Direction Medijob',
    role: UserRole.DIRECTION,
    envKeys: ['SEED_DIRECTION_PASSWORD'],
    fallback: 'direction-medijob-2026',
  },
  {
    email: 'recruteur@medijob.fr',
    name: 'Recruteur Medijob',
    role: UserRole.RECRUTEUR,
    envKeys: ['SEED_RECRUTEUR_PASSWORD'],
    fallback: 'recruteur-medijob-2026',
  },
  {
    email: 'communication@medijob.fr',
    name: 'Communication Medijob',
    role: UserRole.COMMUNICATION,
    envKeys: ['SEED_COMMUNICATION_PASSWORD'],
    fallback: 'communication-medijob-2026',
  },
  {
    email: 'admin@medijob.fr',
    name: 'RH-Admin Medijob',
    role: UserRole.RH_ADMIN,
    // Legacy SEED_ADMIN_PASSWORD kept for old Vercel envs
    envKeys: ['SEED_RH_ADMIN_PASSWORD', 'SEED_ADMIN_PASSWORD'],
    fallback: 'admin-medijob-2026',
  },
]

/** Optional personal tester — always included unless SEED_TESTER_EMAIL=off */
function testerSeedUser(): SeedUserDef | null {
  const email = process.env.SEED_TESTER_EMAIL
  if (email === 'off') return null
  return {
    email: email && email.length > 0 ? email : DEFAULT_TESTER_EMAIL,
    name: DEFAULT_TESTER_NAME,
    role: UserRole.RH_ADMIN,
    envKeys: ['SEED_TESTER_PASSWORD'],
    fallback: DEFAULT_TESTER_PASSWORD,
  }
}

export function listSeedUsers(): SeedUserDef[] {
  const tester = testerSeedUser()
  return tester ? [...CORE_SEED_USERS, tester] : [...CORE_SEED_USERS]
}

export function pickSeedPassword(
  envValue: string | undefined,
  fallback: string,
): string {
  return envValue && envValue.length > 0 ? envValue : fallback
}

export function resolveSeedPassword(envKeys: readonly string[], fallback: string): string {
  for (const key of envKeys) {
    const value = process.env[key]
    if (value && value.length > 0) return value
  }
  return fallback
}

export async function seedUsers(prisma: PrismaClient) {
  for (const user of listSeedUsers()) {
    const password = await hashPassword(resolveSeedPassword(user.envKeys, user.fallback))
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role, password, deletedAt: null },
      create: { email: user.email, name: user.name, role: user.role, password },
    })
  }
}
