import type { Prisma } from '@prisma/client'

const contains = (needle: string): Prisma.StringFilter => ({
  contains: needle,
  mode: 'insensitive',
})

function tokenWhere(token: string): Prisma.CandidateWhereInput {
  const needle = contains(token)
  return {
    OR: [
      { firstName: needle },
      { lastName: needle },
      { email: needle },
      { phone: needle },
      { city: needle },
      { postalCode: needle },
      { jobTitle: { name: needle } },
    ],
  }
}

export function buildPersonSearchWhere(query: string): Prisma.CandidateWhereInput {
  const tokens = query.trim().split(/\s+/).filter(Boolean)
  if (tokens.length <= 1) return tokenWhere(tokens[0] ?? '')
  return { AND: tokens.map(tokenWhere) }
}
