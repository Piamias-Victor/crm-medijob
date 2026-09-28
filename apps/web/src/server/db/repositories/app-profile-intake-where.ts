import type { Prisma } from '@prisma/client'
import type { ListIntakeFollowUpOpts } from './app-profile.repository.types'

function defaultPopulation(): Prisma.AppProfileWhereInput {
  return {
    AND: [
      { status: { not: 'IGNORE' } },
      {
        OR: [{ candidateId: null }, { candidate: { is: { status: 'NOUVEAU' } } }],
      },
    ],
  }
}

function archivePopulation(): Prisma.AppProfileWhereInput {
  return {
    OR: [
      { status: 'IGNORE' },
      { candidate: { is: { status: { not: 'NOUVEAU' } } } },
    ],
  }
}

function withReferentScope(
  base: Prisma.AppProfileWhereInput,
  opts: ListIntakeFollowUpOpts,
): Prisma.AppProfileWhereInput {
  if (opts.referentScope !== 'mine' || !opts.currentUserId) return base
  return {
    AND: [base, { OR: [{ referentId: opts.currentUserId }, { referentId: null }] }],
  }
}

export function intakeFollowUpWhere(
  opts: ListIntakeFollowUpOpts = {},
): Prisma.AppProfileWhereInput {
  const population =
    opts.population === 'archive' ? archivePopulation() : defaultPopulation()
  return withReferentScope(population, opts)
}
