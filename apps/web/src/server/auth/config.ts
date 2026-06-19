import type { NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'
import { evaluateAccess, HOME_PATH, LOGIN_PATH, type AccessRole } from './access'
import { applyTokenToSession } from './session-from-token'
import { getAuthSecret, validateServerEnv } from '@/server/env'

validateServerEnv()

export const authConfig = {
  trustHost: true,
  secret: getAuthSecret(),
  pages: { signIn: LOGIN_PATH },
  providers: [],
  callbacks: {
    session({ session, token }) {
      return applyTokenToSession(session, token)
    },
    authorized({ auth, request }) {
      const role = (auth?.user?.role ?? null) as AccessRole
      const decision = evaluateAccess({
        loggedIn: Boolean(auth?.user),
        role,
        pathname: request.nextUrl.pathname,
      })
      if (decision === 'allow') return true
      if (decision === 'redirect-login') return false
      return NextResponse.redirect(new URL(HOME_PATH, request.nextUrl))
    },
  },
} satisfies NextAuthConfig
