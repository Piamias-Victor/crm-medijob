import type { Prisma } from '@prisma/client'
import type { ListIntakeFollowUpOpts } from './app-profile.repository.types'

export function intakeFollowUpWhere(
  opts: ListIntakeFollowUpOpts = {},
): Prisma.AppProfileWhereInput {
  const base: Prisma.AppProfileWhereInput = {
    status: { notIn: ['APP_VALIDATED', 'IGNORE'] },
  }
  if (opts.referentScope === 'mine' && opts.currentUserId) {
    return {
      ...base,
      OR: [{ referentId: opts.currentUserId }, { referentId: null }],
    }
  }
  return base
}
