import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { InterviewQuestionInputs } from '@/components/molecules/InterviewQuestionInputs'
import type { InterviewRunQuestion } from '@/view-models/interview-template'

function question(prompt: string, answers?: InterviewRunQuestion['suggestedAnswers']): InterviewRunQuestion {
  return {
    id: 'q1',
    question: prompt,
    eliminatoire: false,
    suggestedAnswers: answers ?? [{ label: 'Liberté', text: 'Liberté' }],
  }
}

function Harness({ item }: { item: InterviewRunQuestion }) {
  const [choice, setChoice] = useState('')
  return <InterviewQuestionInputs question={item} choiceLabel={choice} onChoice={setChoice} />
}

describe('InterviewQuestionInputs', () => {
  it.each([
    ['Qu’est-ce qui vous plaît dans le remplacement / l’intérim ?', 'Variété d’officines'],
    ['Quel type de remplacement recherchez-vous (durée, autonomie, type d’officine) ?', '1 à 3 jours'],
    ['Quelles sont vos attentes et vos critères prioritaires ?', 'Rémunération'],
    [
      'Comment réagissez-vous lorsque vous intégrez une nouvelle équipe pour une mission courte ?',
      'À l’aise tout de suite',
    ],
  ])('renders multi checkboxes for %s', (prompt, chip) => {
    render(<Harness item={question(prompt)} />)
    expect(screen.getByRole('checkbox', { name: chip })).toBeInTheDocument()
  })

  it('renders Maintenant as the same checkbox chip', () => {
    render(
      <Harness item={question('À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?')} />,
    )
    expect(screen.getByRole('checkbox', { name: 'Maintenant' })).toBeInTheDocument()
  })

  it('lets recruiter tick several chips at once', () => {
    render(<Harness item={question('Qu’est-ce qui vous plaît dans le remplacement / l’intérim ?')} />)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Variété d’officines' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Liberté d’agenda' }))
    expect(screen.getByRole('checkbox', { name: 'Variété d’officines' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Liberté d’agenda' })).toBeChecked()
  })

  it('keeps ordre answers exclusive', () => {
    render(
      <Harness
        item={question('Êtes-vous inscrit(e) à l’Ordre ?', [
          { label: 'Non inscrit', text: 'Non inscrit à l’Ordre.' },
          { label: 'Section A', text: 'Inscrit section A.' },
        ])}
      />,
    )
    fireEvent.click(screen.getByRole('checkbox', { name: 'Non inscrit' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Section A' }))
    expect(screen.getByRole('checkbox', { name: 'Non inscrit' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Section A' })).toBeChecked()
  })
})
