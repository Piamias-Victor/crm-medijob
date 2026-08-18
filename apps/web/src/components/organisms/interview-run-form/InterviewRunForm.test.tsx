import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { InterviewRunForm } from '@/components/organisms/interview-run-form/InterviewRunForm'
import { INTERVIEW_AVAILABLE_NOW, INTERVIEW_VALIDATE } from '@/view-models/interview-copy'
import { interviewClosePath } from '@/view-models/interview-href'
import { interviewRunFixture } from '@/view-models/interview-run.fixture'
import type { InterviewRun } from '@/view-models/interview-run'

const { routerPush } = vi.hoisted(() => ({ routerPush: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: routerPush }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    interview: { saveDraft: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) } },
    document: { upload: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) } },
  },
}))

function runWithQuestion(question: InterviewRun['sections'][0]['questions'][0]): InterviewRun {
  return {
    ...interviewRunFixture,
    sections: [{ id: 'custom', title: 'Custom', questions: [question] }],
  }
}

describe('InterviewRunForm', () => {
  it('offers Winpharma and LGPI for software questions', () => {
    render(
      <InterviewRunForm
        run={runWithQuestion({
          id: 'pharm_q9',
          question: 'Quels logiciels métier maîtrisez-vous ?',
          eliminatoire: false,
          suggestedAnswers: [{ label: 'Aucun', text: 'Aucun' }],
        })}
      />,
    )
    expect(screen.getByText('Winpharma')).toBeInTheDocument()
    expect(screen.getByText('LGPI')).toBeInTheDocument()
    expect(screen.queryByText('Aucun')).not.toBeInTheDocument()
  })

  it('offers Maintenant and hides scored availability chips', () => {
    render(
      <InterviewRunForm
        run={runWithQuestion({
          id: 'pharm_q10',
          question: 'À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?',
          eliminatoire: false,
          suggestedAnswers: [{ label: 'Flou', text: 'Flou' }],
        })}
      />,
    )
    expect(screen.getByRole('checkbox', { name: INTERVIEW_AVAILABLE_NOW })).toBeInTheDocument()
    expect(screen.queryByText('Flou')).not.toBeInTheDocument()
  })

  it('uses checkbox chips instead of single-select buttons', () => {
    render(
      <InterviewRunForm
        run={runWithQuestion({
          id: 'pharm_q13',
          question: 'Qu’est-ce qui vous plaît dans le remplacement / l’intérim ?',
          eliminatoire: false,
          suggestedAnswers: [{ label: 'Liberté', text: 'Liberté' }],
        })}
      />,
    )
    expect(screen.getByRole('checkbox', { name: 'Variété d’officines' })).toBeInTheDocument()
    expect(screen.queryByText('Liberté')).not.toBeInTheDocument()
  })

  it('exposes a Clôturer action that opens the close screen', () => {
    render(<InterviewRunForm run={interviewRunFixture} />)
    fireEvent.click(screen.getByRole('button', { name: INTERVIEW_VALIDATE }))
    expect(routerPush).toHaveBeenCalledWith(
      interviewClosePath(interviewRunFixture.candidateId, interviewRunFixture.id),
    )
  })
})
