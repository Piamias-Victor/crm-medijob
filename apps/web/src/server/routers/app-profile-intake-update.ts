import { permissionProcedure } from '@/server/trpc'
import { toAppProfileListItem } from '@/view-models/app-profile-list'
import { updateIntakeSchema } from '@/view-models/app-profile-intake.schema'
import { buildIntakeStampUpdate } from '@/view-models/app-profile-intake-stamp'
import { toReferentIdOrNull } from '@/view-models/optional-referent-id.schema'
import { mirrorIntakeToCandidate } from '@/server/app-profile/mirror-intake-to-candidate'
import type { AppProfileDeps } from './app-profile.deps'

export function updateIntakeProcedure(deps: AppProfileDeps) {
  return permissionProcedure('crm.write')
    .input(updateIntakeSchema)
    .mutation(async ({ input, ctx }) => {
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
      if (row.candidateId) {
        await mirrorIntakeToCandidate(
          {
            logActivity: deps.logActivity,
            updateCandidateReferent: deps.updateCandidateReferent,
          },
          {
            candidateId: row.candidateId,
            authorId: ctx.session.user.id,
            previous: {
              intakeStatus:
                (typeof current?.intakeStatus === 'object' && current.intakeStatus
                  ? current.intakeStatus.id
                  : null) ??
                current?.intakeStatusId ??
                'A_APPELER',
              callOutcome: current?.callOutcome ?? null,
              plannedRdvAt: current?.plannedRdvAt ?? null,
              notes: current?.notes ?? null,
              referentId: current?.referentId ?? null,
              relanceAt: current?.relanceAt ?? null,
            },
            next: {
              intakeStatus: stamped.intakeStatus,
              callOutcome: stamped.callOutcome,
              plannedRdvAt: stamped.plannedRdvAt,
              notes: stamped.notes,
              referentId: stamped.referentId,
              relanceAt: stamped.relanceAt,
            },
          },
        )
      }
      return toAppProfileListItem(row)
    })
}
