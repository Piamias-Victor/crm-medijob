import type { UserRole } from '@/server/auth/permissions'
import { can } from '@/server/auth/permissions'

/** Single gate for Activité page, nav, and service (delegates to finance.view). */
export function canViewActivity(role: UserRole | null | undefined): boolean {
  return role != null && can(role, 'finance.view')
}
