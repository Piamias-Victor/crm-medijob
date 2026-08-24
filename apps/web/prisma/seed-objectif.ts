import type { PrismaClient } from '@prisma/client'
import { DEFAULT_OBJECTIF, OBJECTIF_SINGLETON_ID } from '../src/view-models/objectif'

export async function seedObjectif(prisma: PrismaClient) {
  await prisma.objectif.upsert({
    where: { id: OBJECTIF_SINGLETON_ID },
    update: {},
    create: { id: OBJECTIF_SINGLETON_ID, ...DEFAULT_OBJECTIF },
  })
}
