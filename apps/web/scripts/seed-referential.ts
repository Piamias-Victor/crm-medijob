import { readFileSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'
import { seedReferential } from '../prisma/seed-referential'

function loadDatabaseUrl() {
  const text = readFileSync('.env', 'utf8')
  const match = text.match(/^DATABASE_URL=(.*)$/m)
  if (!match) throw new Error('DATABASE_URL missing')
  return match[1].trim().replace(/^["']|["']$/g, '')
}

async function main() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = loadDatabaseUrl()
  }
  const prisma = new PrismaClient()
  console.log('host', process.env.DATABASE_URL.split('@')[1]?.split('/')[0])
  await seedReferential(prisma)
  const [jt, soft, grp, pipe, tpl, roles] = await Promise.all([
    prisma.jobTitle.count(),
    prisma.software.count(),
    prisma.groupement.count(),
    prisma.pipelineStage.count(),
    prisma.interviewTemplate.count(),
    prisma.contactRole.count(),
  ])
  console.log(JSON.stringify({ jt, soft, grp, pipe, tpl, roles }))
  await prisma.$disconnect()
}

main().catch(async (error) => {
  console.error(error)
  process.exit(1)
})
