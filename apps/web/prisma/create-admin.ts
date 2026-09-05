/**
 * Create a single CRM admin on an empty DB (prod AWS).
 *
 *   DATABASE_URL=… \
 *   ADMIN_EMAIL=victor@… \
 *   ADMIN_PASSWORD='…' \
 *   ADMIN_NAME='Victor' \
 *   ADMIN_ROLE=DIRECTION \
 *   pnpm db:create-admin
 */
import { PrismaClient, UserRole } from '@prisma/client'
import { hashPassword } from '../src/server/auth/password'

const ROLES = new Set<string>(Object.values(UserRole))

function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} is required`)
  return value
}

function role(): UserRole {
  const raw = (process.env.ADMIN_ROLE ?? 'DIRECTION').trim()
  if (!ROLES.has(raw)) throw new Error(`ADMIN_ROLE must be one of: ${[...ROLES].join(', ')}`)
  return raw as UserRole
}

async function main() {
  const email = required('ADMIN_EMAIL').toLowerCase()
  const password = required('ADMIN_PASSWORD')
  const name = process.env.ADMIN_NAME?.trim() || 'Victor'
  const userRole = role()
  const prisma = new PrismaClient()
  try {
    const hashed = await hashPassword(password)
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, role: userRole, password: hashed, deletedAt: null },
      create: { email, name, role: userRole, password: hashed },
    })
    console.log(`Admin ready: ${user.email} (${user.role})`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
