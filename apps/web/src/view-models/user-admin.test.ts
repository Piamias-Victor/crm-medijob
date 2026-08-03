import { describe, it, expect } from 'vitest'
import { USER_ROLE_OPTIONS, formatUserRole } from '@/view-models/user-admin'

describe('USER_ROLE_OPTIONS', () => {
  it('exposes the four V1 roles for the role combobox', () => {
    expect(USER_ROLE_OPTIONS).toEqual([
      { value: 'DIRECTION', label: formatUserRole('DIRECTION') },
      { value: 'RECRUTEUR', label: formatUserRole('RECRUTEUR') },
      { value: 'COMMUNICATION', label: formatUserRole('COMMUNICATION') },
      { value: 'RH_ADMIN', label: formatUserRole('RH_ADMIN') },
    ])
  })
})
