import { appRouter } from '@/server/routers/_app'
import { createTRPCContext, createCallerFactory } from '@/server/trpc'

export async function createServerCaller() {
  return createCallerFactory(appRouter)(await createTRPCContext())
}
