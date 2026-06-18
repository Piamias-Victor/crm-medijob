import { describe, it, expect } from 'vitest'
import { USER_ROLE_OPTIONS, formatUserRole } from '@/view-models/user-admin'

describe('USER_ROLE_OPTIONS', () => {
  it('exposes recruiter and admin labels for the role combobox', () => {
    expect(USER_ROLE_OPTIONS).toEqual([
      { value: 'RECRUTEUR', label: formatUserRole('RECRUTEUR') },
      { value: 'ADMIN', label: formatUserRole('ADMIN') },
    ])
  })
})
