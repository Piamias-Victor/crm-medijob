// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  buildCvthequeReturnPath,
  cvthequeCandidateHref,
  parseCvthequeBackHref,
  candidateBackLabel,
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
    expect(parseCvthequeBackHref(encodeURIComponent('/interim/candidats-evil'))).toBe('/candidats')
  })

  it('restaure le retour depuis la base intérim', () => {
    expect(parseCvthequeBackHref(encodeURIComponent('/interim/candidats'))).toBe(
      '/interim/candidats',
    )
    expect(
      parseCvthequeBackHref(encodeURIComponent('/interim/candidats?metier=jt1')),
    ).toBe('/interim/candidats?metier=jt1')
  })

  it('restaure le retour depuis les disponibilités', () => {
    expect(parseCvthequeBackHref(encodeURIComponent('/interim/disponibilites'))).toBe(
      '/interim/disponibilites',
    )
    expect(
      parseCvthequeBackHref(encodeURIComponent('/interim/disponibilites?dispos=yes')),
    ).toBe('/interim/disponibilites?dispos=yes')
  })

  it('compose return path avec query', () => {
    expect(buildCvthequeReturnPath('/candidats', 'metier=jt1')).toBe('/candidats?metier=jt1')
    expect(buildCvthequeReturnPath('/candidats', '')).toBe('/candidats')
  })

  it('label retour selon origine', () => {
    expect(candidateBackLabel('/candidats')).toBe('CVthèque')
    expect(candidateBackLabel('/candidats?metier=jt1')).toBe('CVthèque')
    expect(candidateBackLabel('/interim/candidats')).toBe('Intérim')
    expect(candidateBackLabel('/interim/disponibilites?dispos=yes')).toBe('Disponibilités')
  })
})
