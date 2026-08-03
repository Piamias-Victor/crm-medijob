import { PrismaClient, UserRole } from '@prisma/client'
import { hashPassword } from '../src/server/auth/password'

const SEED_USERS = [
  {
    email: 'direction@medijob.fr',
    name: 'Direction Medijob',
    role: UserRole.DIRECTION,
    envKey: 'SEED_DIRECTION_PASSWORD',
    fallback: 'direction-medijob-2026',
  },
  {
    email: 'recruteur@medijob.fr',
    name: 'Recruteur Medijob',
    role: UserRole.RECRUTEUR,
    envKey: 'SEED_RECRUTEUR_PASSWORD',
    fallback: 'recruteur-medijob-2026',
  },
  {
    email: 'communication@medijob.fr',
    name: 'Communication Medijob',
    role: UserRole.COMMUNICATION,
    envKey: 'SEED_COMMUNICATION_PASSWORD',
    fallback: 'communication-medijob-2026',
  },
  {
    email: 'admin@medijob.fr',
    name: 'RH-Admin Medijob',
    role: UserRole.RH_ADMIN,
    envKey: 'SEED_RH_ADMIN_PASSWORD',
    fallback: 'admin-medijob-2026',
  },
] as const

export function pickSeedPassword(envValue: string | undefined, fallback: string): string {
  return envValue && envValue.length > 0 ? envValue : fallback
}

export async function seedUsers(prisma: PrismaClient) {
  for (const user of SEED_USERS) {
    const password = await hashPassword(pickSeedPassword(process.env[user.envKey], user.fallback))
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role, password, deletedAt: null },
      create: { email: user.email, name: user.name, role: user.role, password },
    })
  }
}
