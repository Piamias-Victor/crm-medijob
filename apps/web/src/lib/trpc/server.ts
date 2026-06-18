import { appRouter } from '@/server/routers/_app'
import { createTRPCContext, createCallerFactory } from '@/server/trpc'

const createCaller = createCallerFactory(appRouter)

export const getServerCaller = async () => createCaller(await createTRPCContext())
