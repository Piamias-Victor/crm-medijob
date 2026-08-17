import { DEFAULT_TESTER_EMAIL, DEFAULT_TESTER_PASSWORD } from '@/server/auth/dev-tester'

type Env = Record<string, string | undefined>

export const DEV_AUTO_LOGIN_PATH = '/api/auth/dev-login'

export function isDevAutoLogin(env: Env = process.env): boolean {
  if (env.NODE_ENV === 'production') return false
  return env.AUTH_DEV_AUTO_LOGIN !== 'off'
}

export function shouldRedirectToDevAutoLogin(error?: string, env: Env = process.env): boolean {
  return isDevAutoLogin(env) && !error
}

export function devTesterCredentials(env: Env = process.env): { email: string; password: string } {
  const email =
    env.SEED_TESTER_EMAIL && env.SEED_TESTER_EMAIL !== 'off'
      ? env.SEED_TESTER_EMAIL
      : DEFAULT_TESTER_EMAIL
  const password =
    env.SEED_TESTER_PASSWORD && env.SEED_TESTER_PASSWORD.length > 0
      ? env.SEED_TESTER_PASSWORD
      : DEFAULT_TESTER_PASSWORD
  return { email, password }
}
