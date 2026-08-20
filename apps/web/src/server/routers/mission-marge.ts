import { protectedProcedure } from '@/server/trpc'
import { updateMargeSchema } from '@/view-models/mission-marge.schema'
import type { LogEntityLifecycle } from '@/server/activity-log/log-entity-lifecycle'

type Deps = {
  updateMarge: (id: string, marge: number | null) => Promise<unknown>
  logLifecycle: LogEntityLifecycle
}

export function missionUpdateMarge(deps: Deps) {
  return protectedProcedure.input(updateMargeSchema).mutation(async ({ ctx, input }) => {
    const row = await deps.updateMarge(input.id, input.marge ?? null)
    await deps.logLifecycle({
      action: 'updated',
      entityType: 'MISSION',
      entityId: input.id,
      user: ctx.session.user,
    })
    return row
  })
}
