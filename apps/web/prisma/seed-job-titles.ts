import type { PrismaClient } from '@prisma/client'
import { JOB_TITLE_PROFILE_KEYS, JOB_TITLE_RENAMES, JOB_TITLES } from './seed-data'

export async function seedJobTitles(prisma: PrismaClient) {
  for (const [from, to] of JOB_TITLE_RENAMES) {
    await prisma.jobTitle.updateMany({ where: { name: from }, data: { name: to } })
  }
  for (const name of JOB_TITLES) {
    await prisma.jobTitle.upsert({
      where: { name },
      update: { profileKey: JOB_TITLE_PROFILE_KEYS[name] },
      create: { name, profileKey: JOB_TITLE_PROFILE_KEYS[name] },
    })
  }
}
