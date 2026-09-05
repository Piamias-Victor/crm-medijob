import { describe, expect, it } from 'vitest'
import { toBadakanInternalNotes } from './badakan-comment'

const comment = {
  id: 'c1',
  content: 'Répondeur : Entretien téléphonique.',
  authorName: 'Jensie Deslances',
  date: new Date('2026-03-12T14:32:00.000Z'),
}

describe('toBadakanInternalNotes', () => {
  it('returns empty when there are no comments', () => {
    expect(toBadakanInternalNotes([])).toBe('')
  })

  it('joins author, date and content for Notes internes', () => {
    const notes = toBadakanInternalNotes([comment])
    expect(notes).toContain('Jensie Deslances')
    expect(notes).toContain('12 mars 2026')
    expect(notes).toContain('Répondeur : Entretien téléphonique.')
  })

  it('separates several comments with a blank line', () => {
    const notes = toBadakanInternalNotes([
      comment,
      { ...comment, id: 'c2', content: 'Rappel demain.' },
    ])
    expect(notes).toContain('Répondeur : Entretien téléphonique.\n\n')
    expect(notes).toContain('Rappel demain.')
  })
})
