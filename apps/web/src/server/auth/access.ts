export type AccessRole = 'RECRUTEUR' | 'ADMIN' | null

export type AccessDecision = 'allow' | 'redirect-login' | 'redirect-home' | 'forbid-admin'

export const LOGIN_PATH = '/login'
export const HOME_PATH = '/candidats'

export function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

export function isLoginPath(pathname: string): boolean {
  return pathname === LOGIN_PATH
}

export function evaluateAccess(input: {
  loggedIn: boolean
  role: AccessRole
  pathname: string
}): AccessDecision {
  const { loggedIn, role, pathname } = input

  if (isLoginPath(pathname)) {
    return loggedIn ? 'redirect-home' : 'allow'
  }
  if (!loggedIn) {
    return 'redirect-login'
  }
  if (isAdminPath(pathname) && role !== 'ADMIN') {
    return 'forbid-admin'
  }
  return 'allow'
}
