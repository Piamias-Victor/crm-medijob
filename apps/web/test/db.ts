import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'

// Ryuk reaper image pull is unreliable offline; afterAll stops containers.
process.env.TESTCONTAINERS_RYUK_DISABLED ??= 'true'

export interface TestDb {
  prisma: PrismaClient
  stop: () => Promise<void>
}

// Spins an ephemeral Postgres, applies migrations, returns a scoped client.
export async function startTestDb(): Promise<TestDb> {
  const container: StartedPostgreSqlContainer =
    await new PostgreSqlContainer('postgres:16-alpine').start()
  const url = container.getConnectionUri()

  execSync('pnpm exec prisma migrate deploy', {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'ignore',
  })

  const prisma = new PrismaClient({ datasources: { db: { url } } })

  return {
    prisma,
    stop: async () => {
      await prisma.$disconnect()
      await container.stop()
    },
  }
}
