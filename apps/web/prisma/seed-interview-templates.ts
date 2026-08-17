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
    await prisma.interviewTemplate.upsert({
      where: {
        profileKey_mode_version: {
          profileKey: trame.profileKey,
          mode: trame.mode,
          version: trame.version,
        },
      },
      update: { label: trame.label, sections: trame.sections },
      create: {
        profileKey: trame.profileKey,
        mode: trame.mode,
        version: trame.version,
        label: trame.label,
        sections: trame.sections,
      },
    })
  }
}
