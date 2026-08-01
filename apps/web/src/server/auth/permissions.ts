export const USER_ROLES = [
  'DIRECTION',
  'RECRUTEUR',
  'COMMUNICATION',
  'RH_ADMIN',
] as const

export type UserRole = (typeof USER_ROLES)[number]

export type PermissionAction =
  | 'crm.write'
  | 'admin'
  | 'softDelete'
  | 'export'
  | 'finance.view'

const ADMIN_ROLES: readonly UserRole[] = ['DIRECTION', 'RH_ADMIN']

const MATRIX: Record<PermissionAction, readonly UserRole[]> = {
  'crm.write': USER_ROLES,
  admin: ADMIN_ROLES,
  softDelete: ADMIN_ROLES,
  export: ADMIN_ROLES,
  'finance.view': ADMIN_ROLES,
}

export function can(role: UserRole, action: PermissionAction): boolean {
  return MATRIX[action].includes(role)
}
