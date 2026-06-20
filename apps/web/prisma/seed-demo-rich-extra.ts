import type { PrismaClient } from '@prisma/client'

export async function seedRichPipelineLinks(
  prisma: PrismaClient,
  stages: { id: string; position: number }[],
) {
  const stageByPos = new Map(stages.map((s) => [s.position, s.id]))
  const links = [
    { missionId: 'rich-mi-1', candidateId: 'rich-ca-1', stageId: stageByPos.get(2)! },
    { missionId: 'rich-mi-1', candidateId: 'rich-ca-8', stageId: stageByPos.get(1)! },
    { missionId: 'rich-mi-2', candidateId: 'rich-ca-2', stageId: stageByPos.get(0)! },
    { missionId: 'rich-mi-4', candidateId: 'rich-ca-5', stageId: stageByPos.get(4)! },
  ]
  for (const link of links) {
    if (!link.stageId) continue
    await prisma.missionCandidate.upsert({
      where: { missionId_candidateId: { missionId: link.missionId, candidateId: link.candidateId } },
      update: { stageId: link.stageId },
      create: link,
    })
  }
}

export async function seedRichInboxApplications(
  prisma: PrismaClient,
  jobTitleByName: Map<string, string>,
) {
  const pharmacienId = jobTitleByName.get('Pharmacien')
  const preparateurId = jobTitleByName.get('Préparateur')
  if (!pharmacienId || !preparateurId) return

  const offer = await prisma.jobOffer.upsert({
    where: { id: 'rich-offer-1' },
    update: {},
    create: { id: 'rich-offer-1', missionId: 'rich-mi-1', title: 'Pharmacien adjoint — Lyon Bellecour', content: '# Offre' },
  })

  const apps = [
    { id: 'rich-app-1', firstName: 'Julie', lastName: 'Fontaine', email: 'julie.fontaine@email.fr', city: 'Lyon', jobTitleId: pharmacienId },
    { id: 'rich-app-2', firstName: 'Marc', lastName: 'Lopez', email: 'marc.lopez@email.fr', city: 'Bron', jobTitleId: preparateurId },
    { id: 'rich-app-3', firstName: 'Sarah', lastName: 'Nguyen', email: 'sarah.nguyen@email.fr', city: 'Paris', jobTitleId: pharmacienId },
  ]

  for (const app of apps) {
    await prisma.application.upsert({
      where: { id: app.id },
      update: {},
      create: { ...app, jobOfferId: offer.id, status: 'EN_ATTENTE' },
    })
  }
}
