// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { boardMetierLabel } from '@/server/job-board/board-metier-label'

describe('boardMetierLabel', () => {
  it('maps Préparateur to site filter label', () => {
    expect(boardMetierLabel('Préparateur')).toBe('Préparateur en pharmacie')
  })

  it('maps Pharmacien to Pharmacien adjoint', () => {
    expect(boardMetierLabel('Pharmacien')).toBe('Pharmacien adjoint')
  })

  it('maps Conseiller parapharmacie to site filter label', () => {
    expect(boardMetierLabel('Conseiller parapharmacie')).toBe(
      'Conseiller(ère) en parapharmacie',
    )
  })

  it('leaves unknown CRM titles unchanged', () => {
    expect(boardMetierLabel('Rayonniste')).toBe('Rayonniste')
    expect(boardMetierLabel('Étudiant en pharmacie')).toBe('Étudiant en pharmacie')
  })
})
