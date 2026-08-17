import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './config'
import { loginSchema } from './schema'
import { validateServerEnv } from '@/server/env'
import { getIdleTimeoutMs } from './constants'

validateServerEnv()

const idleSeconds = Math.max(1, Math.floor(getIdleTimeoutMs() / 1000))

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt', maxAge: idleSeconds },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const parsed = loginSchema.safeParse(raw)
        if (!parsed.success) return null
        const { authorizeCredentials } = await import('./authorize')
        return authorizeCredentials(parsed.data)
      },
    }),
  ],
})
