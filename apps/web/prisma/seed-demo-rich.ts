import type { PrismaClient } from '@prisma/client'
import {
  RICH_CANDIDATES,
  RICH_CONTACTS,
  RICH_MISSIONS,
  RICH_PHARMACIES,
} from './seed-demo-rich-data'
import { seedRichInboxApplications, seedRichPipelineLinks } from './seed-demo-rich-extra'

async function resolveRefs(prisma: PrismaClient, referentId: string) {
  const [groupements, softwares, jobTitles, stages] = await Promise.all([
    prisma.groupement.findMany(),
    prisma.software.findMany(),
    prisma.jobTitle.findMany(),
    prisma.pipelineStage.findMany({ orderBy: { position: 'asc' } }),
  ])
  return {
    referentId,
    groupementByName: new Map(groupements.map((g) => [g.name, g.id])),
    softwareByName: new Map(softwares.map((s) => [s.name, s.id])),
    jobTitleByName: new Map(jobTitles.map((j) => [j.name, j.id])),
    stages,
  }
}

export async function seedDemoRich(prisma: PrismaClient) {
  const referent = await prisma.user.findUniqueOrThrow({ where: { email: 'recruteur@medijob.fr' } })
  const refs = await resolveRefs(prisma, referent.id)

  for (const row of RICH_PHARMACIES) {
    await prisma.pharmacy.upsert({
      where: { id: row.id },
      update: { name: row.name, city: row.city, postalCode: row.postalCode, status: row.status },
      create: {
        id: row.id,
        name: row.name,
        city: row.city,
        postalCode: row.postalCode,
        status: row.status,
        groupementId: row.groupement ? refs.groupementByName.get(row.groupement) : undefined,
        softwareId: row.software ? refs.softwareByName.get(row.software) : undefined,
      },
    })
  }

  for (const row of RICH_CONTACTS) {
    await prisma.contact.upsert({ where: { id: row.id }, update: {}, create: { ...row } })
  }

  for (const row of RICH_CANDIDATES) {
    const jobTitleId = refs.jobTitleByName.get(row.jobTitle)
    if (!jobTitleId) continue
    await prisma.candidate.upsert({
      where: { id: row.id },
      update: { city: row.city, postalCode: row.postalCode },
      create: {
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phone: row.phone,
        city: row.city,
        postalCode: row.postalCode,
        mobilityRadiusKm: row.mobilityRadiusKm,
        jobTitleId,
        referentId: refs.referentId,
      },
    })
  }

  for (const row of RICH_MISSIONS) {
    const jobTitleId = refs.jobTitleByName.get(row.jobTitle)
    if (!jobTitleId) continue
    await prisma.mission.upsert({
      where: { id: row.id },
      update: { status: row.status },
      create: {
        id: row.id,
        title: row.title,
        status: row.status,
        contractType: row.contractType,
        startDate: new Date('2026-07-01'),
        pharmacyId: row.pharmacyId,
        contactId: row.contactId,
        jobTitleId,
        referentId: refs.referentId,
      },
    })
  }

  await seedRichPipelineLinks(prisma, refs.stages)
  await seedRichInboxApplications(prisma, refs.jobTitleByName)
}
