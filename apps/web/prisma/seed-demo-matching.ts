import type { PrismaClient } from '@prisma/client'

export async function seedDemoMatching(prisma: PrismaClient, referentId: string) {
  const pharmacien = await prisma.jobTitle.findUniqueOrThrow({ where: { name: 'Pharmacien' } })
  const preparateur = await prisma.jobTitle.findUniqueOrThrow({ where: { name: 'Préparateur' } })

  await prisma.pharmacy.update({
    where: { id: 'demo-pharmacy' },
    data: { city: 'Lyon', postalCode: '69001' },
  })

  await prisma.candidate.upsert({
    where: { id: 'demo-candidate-1' },
    update: { postalCode: '69003', mobilityRadiusKm: 30 },
    create: {
      id: 'demo-candidate-1',
      firstName: 'Camille',
      lastName: 'Durand',
      city: 'Lyon',
      postalCode: '69003',
      mobilityRadiusKm: 30,
      referentId,
      jobTitleId: pharmacien.id,
    },
  })

  await prisma.candidate.upsert({
    where: { id: 'demo-candidate-preparateur' },
    update: {},
    create: {
      id: 'demo-candidate-preparateur',
      firstName: 'Lucas',
      lastName: 'Martin',
      city: 'Lyon',
      postalCode: '69007',
      mobilityRadiusKm: 30,
      referentId,
      jobTitleId: preparateur.id,
    },
  })

  await prisma.candidate.upsert({
    where: { id: 'demo-candidate-no-geo' },
    update: {},
    create: {
      id: 'demo-candidate-no-geo',
      firstName: 'Nina',
      lastName: 'Petit',
      city: 'Lyon',
      referentId,
      jobTitleId: pharmacien.id,
    },
  })
}
