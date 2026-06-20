import { PrismaClient, MissionStatus } from '@prisma/client'
import { seedDemoMatching } from './seed-demo-matching'

// Données de démo CVthèque/inbox (idempotentes) pour tests manuels issue #54.
export async function seedDemo(prisma: PrismaClient) {
  const referent = await prisma.user.findUniqueOrThrow({
    where: { email: 'recruteur@medijob.fr' },
  })
  const jobTitle = await prisma.jobTitle.findUniqueOrThrow({ where: { name: 'Pharmacien' } })
  const stage = await prisma.pipelineStage.findUniqueOrThrow({ where: { id: 'seed-stage-0' } })

  const base = { referentId: referent.id, jobTitleId: jobTitle.id }
  const pharmacy = await prisma.pharmacy.upsert({
    where: { id: 'demo-pharmacy' },
    update: {},
    create: { id: 'demo-pharmacy', name: 'Pharmacie du Centre' },
  })

  const contact = await prisma.contact.upsert({
    where: { id: 'demo-contact-1' },
    update: {},
    create: {
      id: 'demo-contact-1',
      pharmacyId: pharmacy.id,
      firstName: 'Marie',
      lastName: 'Curie',
      email: 'marie.curie@example.com',
      phone: '0102030405',
      role: 'TITULAIRE',
      isPrimary: true,
    },
  })

  const missions = await Promise.all(
    [
      ['demo-mission-1', 'Titulaire CDI', MissionStatus.A_POURVOIR],
      ['demo-mission-2', 'Adjoint CDD', MissionStatus.A_POURVOIR],
      ['demo-mission-pourvu', 'Préparateur (pourvu)', MissionStatus.POURVU],
    ].map(([id, title, status]) =>
      prisma.mission.upsert({
        where: { id: id as string },
        update: { contactId: contact.id },
        create: {
          id: id as string,
          title: title as string,
          status: status as MissionStatus,
          contractType: 'CDI',
          startDate: new Date(),
          pharmacyId: pharmacy.id,
          contactId: contact.id,
          ...base,
        },
      }),
    ),
  )

  const candidate = await prisma.candidate.upsert({
    where: { id: 'demo-candidate-1' },
    update: {},
    create: { id: 'demo-candidate-1', firstName: 'Camille', lastName: 'Durand', city: 'Lyon', ...base },
  })

  await Promise.all(
    missions.map((mission) =>
      prisma.missionCandidate.upsert({
        where: { missionId_candidateId: { missionId: mission.id, candidateId: candidate.id } },
        update: {},
        create: { missionId: mission.id, candidateId: candidate.id, stageId: stage.id },
      }),
    ),
  )

  await seedDemoApplications(prisma, missions[0].id, jobTitle.id)
  await seedDemoMatching(prisma, referent.id)
}

async function seedDemoApplications(prisma: PrismaClient, missionId: string, jobTitleId: string) {
  const offer = await prisma.jobOffer.upsert({
    where: { id: 'demo-offer' },
    update: {},
    create: { id: 'demo-offer', missionId, title: 'Pharmacien H/F — Lyon', content: '# Offre' },
  })
  await prisma.application.upsert({
    where: { id: 'demo-application-1' },
    update: {},
    create: {
      id: 'demo-application-1',
      jobOfferId: offer.id,
      firstName: 'Léa',
      lastName: 'Bernard',
      email: 'lea.bernard@example.com',
      city: 'Villeurbanne',
      jobTitleId,
    },
  })
}
