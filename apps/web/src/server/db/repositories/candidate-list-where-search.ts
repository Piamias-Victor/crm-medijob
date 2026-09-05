import type { Prisma } from '@prisma/client'

const contains = (needle: string): Prisma.StringFilter => ({
  contains: needle,
  mode: 'insensitive',
})

export function buildPersonSearchWhere(query: string): Prisma.CandidateWhereInput {
  return {
    OR: [
      { firstName: contains(query) },
      { lastName: contains(query) },
      { email: contains(query) },
      { phone: contains(query) },
      { city: contains(query) },
    ],
  }
}
