import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadakanCommentList } from '@/components/molecules/BadakanCommentList'

const comment = {
  id: 'c1',
  content: 'Répondeur : Entretien téléphonique.',
  authorName: 'Jensie Deslances',
  date: new Date('2026-03-12T14:32:00.000Z'),
}

describe('BadakanCommentList', () => {
  it('shows comment text with author and date', () => {
    render(<BadakanCommentList comments={[comment]} />)
    expect(screen.getByText('Répondeur : Entretien téléphonique.')).toBeInTheDocument()
    expect(screen.getByText(/Jensie Deslances/)).toBeInTheDocument()
    expect(screen.getByText(/12 mars 2026/)).toBeInTheDocument()
  })
})
