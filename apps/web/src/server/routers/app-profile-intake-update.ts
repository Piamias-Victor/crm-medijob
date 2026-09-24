import { protectedProcedure } from '@/server/trpc'
import { toAppProfileListItem } from '@/view-models/app-profile-list'
import { updateIntakeSchema } from '@/view-models/app-profile-intake.schema'
import type { AppProfileDeps } from './app-profile.deps'

export function updateIntakeProcedure(deps: AppProfileDeps) {
  return protectedProcedure.input(updateIntakeSchema).mutation(async ({ input }) => {
    const { id, ...data } = input
    const row = await deps.updateIntake(id, data)
    return toAppProfileListItem(row)
  })
}
