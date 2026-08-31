import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '@/server/trpc'
import { acceptAppProfile, ignoreAppProfile, AppProfileError } from '@/server/app-profile/accept'
import { toAppProfileListItem } from '@/view-models/app-profile-list'
import { appProfileAcceptSchema, appProfileIdSchema } from '@/view-models/app-profile-accept.schema'
import { toCandidateCreateData } from '@/view-models/candidate-profile-map'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import { defaultAppProfileDeps, type AppProfileDeps } from './app-profile.deps'
import { readCommentsOrEmpty } from '@/server/badakan/read-comments'

function mapError(error: unknown): never {
  if (error instanceof AppProfileError) {
    throw new TRPCError({
      code: error.code === 'NOT_FOUND' ? 'NOT_FOUND' : 'BAD_REQUEST',
      message: error.code === 'NOT_FOUND' ? 'Profil app introuvable' : 'Profil déjà traité',
    })
  }
  throw error
}

export function makeAppProfileRouter(deps: AppProfileDeps) {
  return router({
    listPending: protectedProcedure.query(async () => {
      const rows = await deps.listPending()
      return rows.map(toAppProfileListItem)
    }),
    getById: protectedProcedure.input(appProfileIdSchema).query(async ({ input }) => {
      const row = await deps.findById(input.id)
      if (!row) throw new TRPCError({ code: 'NOT_FOUND', message: 'Profil app introuvable' })
      return toAppProfileListItem(row)
    }),
    listComments: protectedProcedure.input(appProfileIdSchema).query(async ({ input }) => {
      const row = await deps.findById(input.id)
      if (!row) throw new TRPCError({ code: 'NOT_FOUND', message: 'Profil app introuvable' })
      return readCommentsOrEmpty(() => deps.getBadakanClient().getComments(row.badakanId))
    }),
    countPending: protectedProcedure.query(() => deps.countPending()),
    ignore: protectedProcedure.input(appProfileIdSchema).mutation(async ({ input }) => {
      try {
        return await ignoreAppProfile(input.id, {
          findById: deps.findById,
          markStatus: deps.markStatus,
        })
      } catch (error) {
        mapError(error)
      }
    }),
    accept: protectedProcedure.input(appProfileAcceptSchema).mutation(async ({ input }) => {
      try {
        return await acceptAppProfile(
          input.id,
          {
            data: input.data
              ? (toCandidateCreateData(input.data as CandidateCreateInput, 'MANUAL') as Record<
                  string,
                  unknown
                >)
              : undefined,
            mergeCandidateId: input.mergeCandidateId,
          },
          {
            findById: deps.findById,
            createCandidate: (data) => deps.createProfile(data as never),
            markStatus: deps.markStatus,
            importCvUrl: deps.importCvUrl,
          },
        )
      } catch (error) {
        mapError(error)
      }
    }),
  })
}

export const appProfileRouter = makeAppProfileRouter(defaultAppProfileDeps)
