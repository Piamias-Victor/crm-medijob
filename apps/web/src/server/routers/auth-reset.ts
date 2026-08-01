import { router, publicProcedure } from '@/server/trpc'
import {
  confirmPasswordResetSchema,
  requestPasswordResetSchema,
} from '@/server/auth/reset-schema'
import {
  confirmPasswordReset,
  requestPasswordReset,
  type ResetPasswordDeps,
} from '@/server/auth/reset-password'
import { makeDefaultResetDeps } from '@/server/auth/reset-password.deps'

export function makeAuthResetRouter(deps: ResetPasswordDeps) {
  return router({
    requestPasswordReset: publicProcedure
      .input(requestPasswordResetSchema)
      .mutation(({ input }) => requestPasswordReset(input, deps)),
    confirmPasswordReset: publicProcedure
      .input(confirmPasswordResetSchema)
      .mutation(({ input }) => confirmPasswordReset(input, deps)),
  })
}

export const authResetRouter = makeAuthResetRouter(makeDefaultResetDeps())
