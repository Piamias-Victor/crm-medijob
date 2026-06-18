import { describe, it, expect } from 'vitest'
import { evaluateAccess, isAdminPath } from './access'

describe('isAdminPath', () => {
  it('flags /admin and nested admin routes', () => {
    expect(isAdminPath('/admin')).toBe(true)
    expect(isAdminPath('/admin/utilisateurs')).toBe(true)
    expect(isAdminPath('/candidats')).toBe(false)
  })
})

describe('evaluateAccess', () => {
  it('redirects anonymous users to login', () => {
    expect(evaluateAccess({ loggedIn: false, role: null, pathname: '/candidats' })).toBe(
      'redirect-login',
    )
  })

  it('lets a logged-in recruiter reach the CRM', () => {
    expect(
      evaluateAccess({ loggedIn: true, role: 'RECRUTEUR', pathname: '/candidats' }),
    ).toBe('allow')
  })

  it('forbids a recruiter from admin routes', () => {
    expect(evaluateAccess({ loggedIn: true, role: 'RECRUTEUR', pathname: '/admin' })).toBe(
      'forbid-admin',
    )
  })

  it('lets an admin reach admin routes', () => {
    expect(evaluateAccess({ loggedIn: true, role: 'ADMIN', pathname: '/admin' })).toBe('allow')
  })

  it('sends a logged-in user away from the login page', () => {
    expect(evaluateAccess({ loggedIn: true, role: 'ADMIN', pathname: '/login' })).toBe(
      'redirect-home',
    )
  })

  it('allows anonymous access to the login page', () => {
    expect(evaluateAccess({ loggedIn: false, role: null, pathname: '/login' })).toBe('allow')
  })
})
