import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '@/server/trpc'
import { acceptApplication } from '@/server/application/accept'
import { mapApplicationError } from '@/server/routers/application-errors'
import { defaultApplicationDeps, type ApplicationDeps } from '@/server/routers/application.deps'
import { applicationAcceptSchema } from '@/view-models/application-accept.schema'
import { toCandidateCreateData } from '@/view-models/candidate-profile-map'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import { idSchema } from '@/lib/schemas/entity-id'

export type { ApplicationDeps }

export function makeApplicationRouter(deps: ApplicationDeps) {
  return router({
    listInbox: protectedProcedure.query(() => deps.listInbox()),
    getById: protectedProcedure.input(idSchema).query(async ({ input }) => {
      const row = await deps.getById(input.id)
      if (!row) throw new TRPCError({ code: 'NOT_FOUND', message: 'Application not found' })
      return row
    }),
    detectDuplicate: protectedProcedure.input(idSchema).query(({ input }) =>
      deps.detectDuplicate(input.id),
    ),
    refuse: protectedProcedure.input(idSchema).mutation(async ({ input }) => {
      try {
        return await deps.refuse(input.id)
      } catch (error) {
        mapApplicationError(error)
      }
    }),
    accept: protectedProcedure.input(applicationAcceptSchema).mutation(async ({ input }) => {
      try {
        return await acceptApplication(
          input.id,
          {
            data: input.data
              ? (toCandidateCreateData(input.data as CandidateCreateInput, 'SITE') as Record<
                  string,
                  unknown
                >)
              : undefined,
            mergeCandidateId: input.mergeCandidateId,
          },
          {
            findById: deps.findById,
            createCandidate: (data) => deps.createProfile(data as never),
            markAccepted: deps.markAccepted,
            copyCvUrl: (sourceUrl) => deps.copyCvUrl(sourceUrl, input.id),
          },
        )
      } catch (error) {
        mapApplicationError(error)
      }
    }),
  })
}

export const applicationRouter = makeApplicationRouter(defaultApplicationDeps)
