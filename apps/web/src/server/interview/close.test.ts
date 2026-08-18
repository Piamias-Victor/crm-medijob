import { describe, expect, it } from 'vitest'
import { closeInterview } from '@/server/interview/close'
import { memoryCloseDeps } from '@/server/interview/close.test.fixtures'

describe('closeInterview', () => {
  it('closes a DRAFT with scores and decision', async () => {
    const deps = memoryCloseDeps()
    const result = await closeInterview(
      { id: 'i1', scores: { B1: 12 }, decision: 'ELIGIBLE' },
      'u1',
      deps,
    )
    expect(result).toMatchObject({ id: 'i1', candidateId: 'c1' })
    expect(deps.interviews[0]).toMatchObject({
      status: 'CLOSED',
      decision: 'ELIGIBLE',
      scores: { B1: 12 },
    })
  })

  it('refuses to close an already CLOSED interview', async () => {
    const deps = memoryCloseDeps({ status: 'CLOSED', decision: 'REVIEW', scores: { B1: 4 } })
    await expect(
      closeInterview({ id: 'i1', scores: { B1: 99 }, decision: 'ELIGIBLE' }, 'u1', deps),
    ).rejects.toMatchObject({ message: 'INTERVIEW_NOT_DRAFT' })
    expect(deps.interviews[0]?.scores).toEqual({ B1: 4 })
  })

  it('fills empty candidate fields and skips filled ones without overwrite', async () => {
    const deps = memoryCloseDeps(
      {
        answers: { questions: { q10: { choiceLabel: '2026-09-01' } }, checklist: {} },
      },
      { availableFrom: new Date('2026-01-01') },
      [
        {
          id: 'q10',
          question: 'À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?',
        },
      ],
    )
    await closeInterview({ id: 'i1', scores: { B1: 12 }, decision: 'ELIGIBLE' }, 'u1', deps)
    expect(deps.candidate.availableFrom).toEqual(new Date('2026-01-01'))
  })

  it('does not change candidate status unless applyStatus is confirmed', async () => {
    const deps = memoryCloseDeps()
    await closeInterview({ id: 'i1', scores: { B1: 12 }, decision: 'ELIGIBLE' }, 'u1', deps)
    expect(deps.candidate.status).toBe('NOUVEAU')
  })

  it('logs an ActivityLog entry on close', async () => {
    const deps = memoryCloseDeps()
    await closeInterview({ id: 'i1', scores: { B1: 12 }, decision: 'ELIGIBLE' }, 'u1', deps)
    expect(deps.logs).toEqual([
      { candidateId: 'c1', authorId: 'u1', content: 'Entretien clôturé — Éligible' },
    ])
  })

  it('applies Qualifié only when applyStatus is confirmed', async () => {
    const deps = memoryCloseDeps()
    await closeInterview(
      { id: 'i1', scores: { B1: 12 }, decision: 'ELIGIBLE', applyStatus: true },
      'u1',
      deps,
    )
    expect(deps.candidate.status).toBe('QUALIFIE')
  })

  it('overwrites availableFrom only when listed in overwriteFields', async () => {
    const questions = [
      {
        id: 'q10',
        question: 'À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?',
      },
    ]
    const deps = memoryCloseDeps(
      { answers: { questions: { q10: { choiceLabel: '2026-09-01' } }, checklist: {} } },
      { availableFrom: new Date('2026-01-01') },
      questions,
    )
    await closeInterview(
      {
        id: 'i1',
        scores: { B1: 12 },
        decision: 'ELIGIBLE',
        overwriteFields: ['availableFrom'],
      },
      'u1',
      deps,
    )
    expect(deps.candidate.availableFrom).toEqual(new Date('2026-09-01'))
  })
})
