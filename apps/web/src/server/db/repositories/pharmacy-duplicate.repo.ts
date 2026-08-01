import type { PrismaClient } from '@prisma/client'
import { normalizeSiret } from '@/server/pharmacy/normalize-pharmacy-identity'
import { pickNameCityPostalMatch } from '@/server/pharmacy/duplicate-identity-match'

const identitySelect = {
  id: true,
  name: true,
  siret: true,
  city: true,
  postalCode: true,
  deletedAt: true,
} as const

export function makePharmacyDuplicateRepository(db: PrismaClient) {
  return {
    findIdentityBySiret: async (siret: string) => {
      const normalized = normalizeSiret(siret)
      if (!normalized) return null
      return db.pharmacy.findFirst({
        where: { siret: normalized },
        select: identitySelect,
      })
    },
    findIdentityByNameCityPostal: async (name: string, city: string, postalCode: string) => {
      const rows = await db.pharmacy.findMany({
        where: {
          name: { equals: name.trim(), mode: 'insensitive' },
          city: { equals: city.trim(), mode: 'insensitive' },
        },
        select: identitySelect,
        take: 25,
      })
      return pickNameCityPostalMatch(rows, name, city, postalCode)
    },
  }
}
