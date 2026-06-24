import type { PrismaClient } from '@prisma/client'
import { normalizePhoneDigits, phonesMatch } from '@/lib/phone-normalize'
import { NOT_DELETED } from './soft-delete'

const identitySelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
} as const

function phoneContainsFilter(phone: string) {
  const digits = normalizePhoneDigits(phone)
  if (!digits) return { not: null }
  return { contains: digits.length >= 9 ? digits.slice(-9) : digits }
}

export function makeCandidateDuplicateRepository(db: PrismaClient) {
  return {
    findIdentityByEmail: (email: string) =>
      db.candidate.findFirst({
        where: { ...NOT_DELETED, email: { equals: email.trim(), mode: 'insensitive' } },
        select: identitySelect,
      }),
    findIdentityByNamePhone: async (firstName: string, lastName: string, phone: string) => {
      const rows = await db.candidate.findMany({
        where: {
          ...NOT_DELETED,
          firstName: { equals: firstName.trim(), mode: 'insensitive' },
          lastName: { equals: lastName.trim(), mode: 'insensitive' },
          phone: phoneContainsFilter(phone),
        },
        select: identitySelect,
        take: 25,
      })
      return rows.find((row) => row.phone && phonesMatch(row.phone, phone)) ?? null
    },
  }
}
