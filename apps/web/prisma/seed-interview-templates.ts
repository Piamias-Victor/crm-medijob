import type { InterviewMode, Prisma, PrismaClient } from '@prisma/client'
import templates from './data/interview-templates.json'
import { GENERIC_INTERVIEW_TEMPLATES } from './data/interview-generic-templates'

type SeedTrame = {
  profileKey: string
  mode: InterviewMode
  version: number
  label: string
  sections: Prisma.InputJsonValue
}

export async function seedInterviewTemplates(prisma: PrismaClient) {
  const trames: SeedTrame[] = [
    ...(templates as SeedTrame[]),
    ...(GENERIC_INTERVIEW_TEMPLATES as SeedTrame[]),
  ]
  for (const trame of trames) {
    const exists = await prisma.interviewTemplate.findFirst({
      where: { profileKey: trame.profileKey, mode: trame.mode },
      select: { id: true },
    })
    if (exists) continue
    await prisma.interviewTemplate.create({
      data: {
        profileKey: trame.profileKey,
        mode: trame.mode,
        version: 1,
        label: trame.label,
        sections: trame.sections,
      },
    })
  }
}
