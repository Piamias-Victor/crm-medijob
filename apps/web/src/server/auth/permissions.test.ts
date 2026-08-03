import { describe, expect, it } from 'vitest'
import { can, type PermissionAction, type UserRole } from '@/server/auth/permissions'

const ROLES: UserRole[] = ['DIRECTION', 'RECRUTEUR', 'COMMUNICATION', 'RH_ADMIN']

const ADMIN_ONLY: PermissionAction[] = [
  'admin',
  'softDelete',
  'export',
  'finance.view',
  'gdpr.erase',
]

describe('can — client gate (CA/Marge, soft delete, export) + admin', () => {
  it.each(ADMIN_ONLY)('%s allowed for Direction and RH-Admin only', (action) => {
    expect(can('DIRECTION', action)).toBe(true)
    expect(can('RH_ADMIN', action)).toBe(true)
    expect(can('RECRUTEUR', action)).toBe(false)
    expect(can('COMMUNICATION', action)).toBe(false)
  })

  it('lets every role do CRM write (client: not read-only Communication)', () => {
    for (const role of ROLES) {
      expect(can(role, 'crm.write')).toBe(true)
    }
  })
})
