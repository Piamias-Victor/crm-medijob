// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  buildCvthequeReturnPath,
  cvthequeCandidateHref,
  parseCvthequeBackHref,
} from '@/lib/cvtheque-candidate-href'

describe('cvtheque-candidate-href', () => {
  it('encode le retour CVthèque dans le lien candidat', () => {
    const href = cvthequeCandidateHref('c1', '/candidats?metier=jt1&departement=69')
    expect(href).toBe('/candidats/c1?back=%2Fcandidats%3Fmetier%3Djt1%26departement%3D69')
  })

  it('restaure le chemin filtré depuis back', () => {
    expect(parseCvthequeBackHref(encodeURIComponent('/candidats?metier=jt1'))).toBe('/candidats?metier=jt1')
  })

  it('fallback sur /candidats si back absent ou invalide', () => {
    expect(parseCvthequeBackHref(undefined)).toBe('/candidats')
    expect(parseCvthequeBackHref('%')).toBe('/candidats')
    expect(parseCvthequeBackHref(encodeURIComponent('/admin'))).toBe('/candidats')
    expect(parseCvthequeBackHref(encodeURIComponent('/candidats-evil'))).toBe('/candidats')
  })

  it('compose return path avec query', () => {
    expect(buildCvthequeReturnPath('/candidats', 'metier=jt1')).toBe('/candidats?metier=jt1')
    expect(buildCvthequeReturnPath('/candidats', '')).toBe('/candidats')
  })
})
