import { PrismaClient } from '@prisma/client'
import { PIPELINE_STAGES, SOFTWARES, JOB_TITLES, COMPATIBILITY } from './seed-data'

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

async function seedByName(
  names: readonly string[],
  upsert: (name: string) => Promise<unknown>,
) {
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
        where: {
          missionJobTitleId_candidateJobTitleId: {
            missionJobTitleId,
            candidateJobTitleId,
          },
        },
        update: {},
        create: { missionJobTitleId, candidateJobTitleId },
      })
    }
  }
}

async function main() {
  await seedStages()
  await seedByName(SOFTWARES, (name) =>
    prisma.software.upsert({ where: { name }, update: {}, create: { name } }),
  )
  await seedByName(JOB_TITLES, (name) =>
    prisma.jobTitle.upsert({ where: { name }, update: {}, create: { name } }),
  )
  await seedCompatibility()
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
