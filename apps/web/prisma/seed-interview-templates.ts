import type { InterviewMode, PrismaClient } from '@prisma/client'
import templates from './data/interview-templates.json'

type SeedTrame = (typeof templates)[number] & { mode: InterviewMode }

export async function seedInterviewTemplates(prisma: PrismaClient) {
  for (const trame of templates as SeedTrame[]) {
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
