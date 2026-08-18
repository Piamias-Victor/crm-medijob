import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InterviewQuestionInputs } from '@/components/molecules/InterviewQuestionInputs'
import type { InterviewRunQuestion } from '@/view-models/interview-template'

const question: InterviewRunQuestion = {
  id: 'q1',
  question: 'Quels outils utilisez-vous ?',
  eliminatoire: false,
  mapping: 'software',
  suggestedAnswers: [{ label: 'Aucun', text: 'Aucun' }],
}

describe('InterviewQuestionInputs mapping', () => {
  it('uses explicit software mapping when wording does not say logiciel', () => {
    render(<InterviewQuestionInputs question={question} onChoice={() => undefined} />)
    expect(screen.getByRole('checkbox', { name: 'Winpharma' })).toBeInTheDocument()
  })
})
