import type { PrismaClient } from '@prisma/client'

/** Narrow client surface for map pin repos (tests mock findMany only). */
export type MapPinsDb = Pick<PrismaClient, 'pharmacy' | 'candidate' | 'mission'>
