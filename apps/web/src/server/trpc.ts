import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { Session } from 'next-auth'
import { can, type PermissionAction } from '@/server/auth/permissions'
import { mapPrismaError } from '@/server/trpc/prisma-errors'

async function getSession(): Promise<Session | null> {
  try {
    const { auth } = await import('@/server/auth')
    return await auth()
  } catch {
    return null
  }
}

export const createTRPCContext = async () => ({ session: await getSession() })

type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({ transformer: superjson })

const errorMapper = t.middleware(async ({ next }) => {
  const result = await next()
  if (!result.ok) throw mapPrismaError(result.error)
  return result
})

export const router = t.router
export const createCallerFactory = t.createCallerFactory

const baseProcedure = t.procedure.use(errorMapper)
export const publicProcedure = baseProcedure

export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx: { session: ctx.session } })
})

export function permissionProcedure(action: PermissionAction) {
  return protectedProcedure.use(({ ctx, next }) => {
    if (!can(ctx.session.user.role, action)) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }
    return next({ ctx })
  })
}

export const adminProcedure = permissionProcedure('admin')
