import { can, type UserRole } from '@/server/auth/permissions'

export type AccessRole = UserRole | null

export type AccessDecision = 'allow' | 'redirect-login' | 'redirect-home' | 'forbid-admin'

export const LOGIN_PATH = '/login'
export const HOME_PATH = '/accueil'

export function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

export function isFacturationPath(pathname: string): boolean {
  return pathname === '/facturation' || pathname.startsWith('/facturation/')
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
  if (isAdminPath(pathname) && (!role || !can(role, 'admin'))) {
    return 'forbid-admin'
  }
  if (isFacturationPath(pathname) && (!role || !can(role, 'finance.view'))) {
    return 'forbid-admin'
  }
  return 'allow'
}
