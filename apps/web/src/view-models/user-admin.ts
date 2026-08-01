import { USER_ROLES, type UserRole } from '@/server/auth/permissions'

export { USER_ROLES, type UserRole }

export type UserListItem = {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
}

const roleLabels: Record<UserRole, string> = {
  DIRECTION: 'Direction',
  RECRUTEUR: 'Recruteur',
  COMMUNICATION: 'Communication',
  RH_ADMIN: 'RH-Admin',
}

export function formatUserRole(role: UserRole): string {
  return roleLabels[role]
}

export const USER_ROLE_OPTIONS = USER_ROLES.map((role) => ({
  value: role,
  label: formatUserRole(role),
}))

export function formatUserCreatedAt(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
