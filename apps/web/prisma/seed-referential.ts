import type { PrismaClient } from '@prisma/client'
import {
  PIPELINE_STAGES,
  SOFTWARES,
  GROUPEMENTS,
  CONTACT_ROLES,
  COMPATIBILITY,
} from './seed-data'
import { seedJobTitles } from './seed-job-titles'
import { seedInterviewTemplates } from './seed-interview-templates'

async function seedStages(prisma: PrismaClient) {
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

async function seedCompatibility(prisma: PrismaClient) {
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
        update: { score: 100 },
        create: { missionJobTitleId, candidateJobTitleId, score: 100 },
      })
    }
  }
}

/** Référentiel métier CRM (sans users / demo). */
export async function seedReferential(prisma: PrismaClient) {
  await seedStages(prisma)
  await seedByName(SOFTWARES, (name) =>
    prisma.software.upsert({ where: { name }, update: {}, create: { name } }),
  )
  await seedByName(GROUPEMENTS, (name) =>
    prisma.groupement.upsert({ where: { name }, update: {}, create: { name } }),
  )
  await seedJobTitles(prisma)
  await seedByName(CONTACT_ROLES, (name) =>
    prisma.contactRole.upsert({ where: { name }, update: {}, create: { name } }),
  )
  await seedCompatibility(prisma)
  await seedInterviewTemplates(prisma)
}
