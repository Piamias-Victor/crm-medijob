import { describe, it, expect } from 'vitest'
import { evaluateAccess, isAdminPath, isFacturationPath } from './access'

describe('isAdminPath', () => {
  it('flags /admin and nested admin routes', () => {
    expect(isAdminPath('/admin')).toBe(true)
    expect(isAdminPath('/admin/utilisateurs')).toBe(true)
    expect(isAdminPath('/candidats')).toBe(false)
  })
})

describe('isFacturationPath', () => {
  it('flags /facturation and nested facturation routes', () => {
    expect(isFacturationPath('/facturation')).toBe(true)
    expect(isFacturationPath('/facturation/suivi')).toBe(true)
    expect(isFacturationPath('/facturation/placements')).toBe(true)
    expect(isFacturationPath('/facturation/interim')).toBe(true)
    expect(isFacturationPath('/facturation/pilotage')).toBe(true)
    expect(isFacturationPath('/missions')).toBe(false)
    expect(isFacturationPath('/interim')).toBe(false)
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

  it('lets a recruiter reach operational Intérim, not only Facturation Intérim', () => {
    expect(
      evaluateAccess({ loggedIn: true, role: 'RECRUTEUR', pathname: '/interim' }),
    ).toBe('allow')
    expect(
      evaluateAccess({ loggedIn: true, role: 'RECRUTEUR', pathname: '/facturation/interim' }),
    ).toBe('forbid-admin')
  })

  it('forbids a recruiter from admin routes', () => {
    expect(evaluateAccess({ loggedIn: true, role: 'RECRUTEUR', pathname: '/admin' })).toBe(
      'forbid-admin',
    )
  })

  it('forbids a recruiter from facturation routes', () => {
    expect(
      evaluateAccess({ loggedIn: true, role: 'RECRUTEUR', pathname: '/facturation' }),
    ).toBe('forbid-admin')
    expect(
      evaluateAccess({ loggedIn: true, role: 'COMMUNICATION', pathname: '/facturation/suivi' }),
    ).toBe('forbid-admin')
  })

  it('lets Direction and RH-Admin reach facturation routes', () => {
    expect(evaluateAccess({ loggedIn: true, role: 'DIRECTION', pathname: '/facturation' })).toBe(
      'allow',
    )
    expect(
      evaluateAccess({ loggedIn: true, role: 'RH_ADMIN', pathname: '/facturation/suivi' }),
    ).toBe('allow')
  })

  it('lets Direction and RH-Admin reach admin routes', () => {
    expect(evaluateAccess({ loggedIn: true, role: 'DIRECTION', pathname: '/admin' })).toBe(
      'allow',
    )
    expect(evaluateAccess({ loggedIn: true, role: 'RH_ADMIN', pathname: '/admin' })).toBe(
      'allow',
    )
  })

  it('sends a logged-in user away from the login page', () => {
    expect(evaluateAccess({ loggedIn: true, role: 'RH_ADMIN', pathname: '/login' })).toBe(
      'redirect-home',
    )
  })

  it('allows anonymous access to the login page', () => {
    expect(evaluateAccess({ loggedIn: false, role: null, pathname: '/login' })).toBe('allow')
  })

  it('allows anonymous access to the weekly availability page', () => {
    expect(
      evaluateAccess({
        loggedIn: false,
        role: null,
        pathname: '/dispo/unguessable-token-32bytes-base64url',
      }),
    ).toBe('allow')
  })
})
