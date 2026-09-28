import { describe, expect, it } from 'vitest'
import { badakanCommentsListLabel } from './badakan-comment-list-label'
import type { BadakanCommentRow } from './badakan-comment'

const comment: BadakanCommentRow = {
  id: 'c1',
  content: 'Répondeur : Entretien téléphonique.',
  authorName: 'Jensie Deslances',
  date: new Date('2026-03-12T14:32:00.000Z'),
}

describe('badakanCommentsListLabel', () => {
  it('shows empty cell when there are no Badakan comments', () => {
    expect(badakanCommentsListLabel([])).toBe('—')
  })

  it('joins Badakan comment contents for the list cell', () => {
    expect(badakanCommentsListLabel([comment])).toBe('Répondeur : Entretien téléphonique.')
    expect(
      badakanCommentsListLabel([comment, { ...comment, id: 'c2', content: 'Rappel demain.' }]),
    ).toBe('Répondeur : Entretien téléphonique. · Rappel demain.')
  })
})
