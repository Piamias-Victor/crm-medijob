import { protectedProcedure } from '@/server/trpc'
import { toAppProfileListItem } from '@/view-models/app-profile-list'
import { updateIntakeSchema } from '@/view-models/app-profile-intake.schema'
import { buildIntakeStampUpdate } from '@/view-models/app-profile-intake-stamp'
import { toReferentIdOrNull } from '@/view-models/optional-referent-id.schema'
import type { AppProfileDeps } from './app-profile.deps'

export function updateIntakeProcedure(deps: AppProfileDeps) {
  return protectedProcedure.input(updateIntakeSchema).mutation(async ({ input, ctx }) => {
    const { id, referentId, ...rest } = input
    const current = await deps.findById(id)
    const stamped = buildIntakeStampUpdate({
      input: {
        ...rest,
        referentId: toReferentIdOrNull(referentId),
      },
      previousCallOutcome: current?.callOutcome ?? null,
      sessionUserId: ctx.session.user.id,
      now: new Date(),
    })
    const row = await deps.updateIntake(id, stamped)
    return toAppProfileListItem(row)
  })
}
