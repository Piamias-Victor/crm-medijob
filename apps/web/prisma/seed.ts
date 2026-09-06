import { PrismaClient } from '@prisma/client'
import { seedUsers } from './seed-users'
import { seedDemo } from './seed-demo'
import { seedDemoRich } from './seed-demo-rich'
import { seedObjectif } from './seed-objectif'
import { seedReferential } from './seed-referential'

const prisma = new PrismaClient()

async function main() {
  await seedUsers(prisma)
  await seedReferential(prisma)
  await seedObjectif(prisma)
  await seedDemo(prisma)
  await seedDemoRich(prisma)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
