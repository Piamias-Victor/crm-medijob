import { PrismaClient } from '@prisma/client'
import { seedUsers } from './seed-users'
import { seedDemoRich } from './seed-demo-rich'
import { PIPELINE_STAGES, SOFTWARES, GROUPEMENTS, JOB_TITLES, COMPATIBILITY } from './seed-data'

const prisma = new PrismaClient()

async function seedStages() {
  await Promise.all(
    PIPELINE_STAGES.map((name, position) =>
      prisma.pipelineStage.upsert({
        where: { id: `seed-stage-${position}` },
        update: { name, position },
        create: { id: `seed-stage-${position}`, name, position },
      }),
    ),
  )
}

async function seedByName(names: readonly string[], upsert: (name: string) => Promise<unknown>) {
  await Promise.all(names.map(upsert))
}

async function seedCompatibility() {
  const titles = await prisma.jobTitle.findMany()
  const byName = new Map(titles.map((t) => [t.name, t.id]))
  for (const [mission, accepted] of Object.entries(COMPATIBILITY)) {
    const missionJobTitleId = byName.get(mission)
    if (!missionJobTitleId) continue
    for (const candidate of accepted) {
      const candidateJobTitleId = byName.get(candidate)
      if (!candidateJobTitleId) continue
      await prisma.jobTitleCompatibility.upsert({
        where: { missionJobTitleId_candidateJobTitleId: { missionJobTitleId, candidateJobTitleId } },
        update: { score: 100 },
        create: { missionJobTitleId, candidateJobTitleId, score: 100 },
      })
    }
  }
}

async function seedReferentials() {
  await seedStages()
  await seedByName(SOFTWARES, (name) =>
    prisma.software.upsert({ where: { name }, update: {}, create: { name } }),
  )
  await seedByName(GROUPEMENTS, (name) =>
    prisma.groupement.upsert({ where: { name }, update: {}, create: { name } }),
  )
  await seedByName(JOB_TITLES, (name) =>
    prisma.jobTitle.upsert({ where: { name }, update: {}, create: { name } }),
  )
  await seedCompatibility()
}

async function main() {
  await seedUsers(prisma)
  await seedReferentials()
  await seedDemoRich(prisma)
  console.log('Demo rich seed completed.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
