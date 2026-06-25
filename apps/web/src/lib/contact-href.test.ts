import { describe, expect, it } from 'vitest'
import {
  buildContactReturnPath,
  contactDetailHref,
  parseContactBackHref,
} from '@/lib/contact-href'

describe('contact href helpers', () => {
  it('builds return path with search params', () => {
    expect(buildContactReturnPath('/contacts', 'role=TITULAIRE')).toBe('/contacts?role=TITULAIRE')
  })

  it('builds detail href with encoded back path', () => {
    expect(contactDetailHref('c1', '/contacts?role=TITULAIRE')).toBe(
      '/contacts/c1?back=%2Fcontacts%3Frole%3DTITULAIRE',
    )
  })

  it('parses safe contact back hrefs only', () => {
    expect(parseContactBackHref(encodeURIComponent('/contacts?role=TITULAIRE'))).toBe(
      '/contacts?role=TITULAIRE',
    )
    expect(parseContactBackHref(undefined)).toBe('/contacts')
    expect(parseContactBackHref('%')).toBe('/contacts')
    expect(parseContactBackHref(encodeURIComponent('/admin'))).toBe('/contacts')
  })
})
