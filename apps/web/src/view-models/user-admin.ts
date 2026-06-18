export const USER_ROLES = ['RECRUTEUR', 'ADMIN'] as const
export type UserRole = (typeof USER_ROLES)[number]

export type UserListItem = {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
}

const roleLabels: Record<UserRole, string> = {
  RECRUTEUR: 'Recruteur',
  ADMIN: 'Administrateur',
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
