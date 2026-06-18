import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './config'
import { authorizeCredentials } from './authorize'
import { loginSchema } from './schema'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: (raw) => {
        const parsed = loginSchema.safeParse(raw)
        return parsed.success ? authorizeCredentials(parsed.data) : null
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (typeof token.id === 'string') session.user.id = token.id
      if (token.role === 'ADMIN' || token.role === 'RECRUTEUR') {
        session.user.role = token.role
      }
      return session
    },
  },
})
