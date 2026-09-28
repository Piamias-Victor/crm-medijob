import type { Prisma } from '@prisma/client'
import type { ListIntakeFollowUpOpts } from './app-profile.repository.types'

const NEGATIVE_OUTCOMES = ['PAS_INTERESSE', 'HORS_CIBLE'] as const

function defaultPopulation(): Prisma.AppProfileWhereInput {
  return {
    AND: [
      { status: { notIn: ['APP_VALIDATED', 'IGNORE'] } },
      {
        OR: [
          { callOutcome: null },
          { callOutcome: { notIn: [...NEGATIVE_OUTCOMES] } },
        ],
      },
      { intakeStatus: { not: 'HORS_ZONE' } },
    ],
  }
}

function archivePopulation(): Prisma.AppProfileWhereInput {
  return {
    OR: [
      { status: { in: ['APP_VALIDATED', 'IGNORE'] } },
      { callOutcome: { in: [...NEGATIVE_OUTCOMES] } },
      { intakeStatus: 'HORS_ZONE' },
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
