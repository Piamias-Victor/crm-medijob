// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { interviewCaller, interviewRecord, makeInterviewDeps } from '@/server/routers/interview.test.fixtures'

const pharmacienTemplate = {
  label: 'Pharmacien(ne)',
  sections: [
    {
      id: 'diplome',
      title: 'Diplôme & profil',
      questions: [
        {
          id: 'pharm_q4',
          question: 'Êtes-vous inscrit(e) à l’Ordre ?',
          eliminatoire: true,
          suggestedAnswers: [{ label: 'Non', text: 'Non inscrit.', points: 0 }],
        },
      ],
    },
  ],
}

const genericTemplate = {
  label: 'Autre',
  sections: [
    {
      id: 'parcours',
      title: 'Parcours & situation',
      questions: [
        {
          id: 'gen_q1',
          question: 'Quel est votre parcours actuel ?',
          suggestedAnswers: [{ label: 'En poste', text: 'En poste.', points: 8 }],
        },
      ],
    },
  ],
}

describe('interviewRouter getRun', () => {
  it('loads trame questions for the candidate profile and mode', async () => {
    const deps = makeInterviewDeps({
      findById: vi.fn(async () => ({ ...interviewRecord, candidateId: 'c1' })),
      findCandidateProfileKey: vi.fn(async () => 'pharmacien'),
      findTemplate: vi.fn(async () => pharmacienTemplate),
    })
    const run = await interviewCaller(deps).getRun({ id: 'i1' })
    expect(run?.sections[0]?.title).toBe('Diplôme & profil')
    expect(run?.sections[0]?.questions[0]).toMatchObject({
      id: 'pharm_q4',
      eliminatoire: true,
    })
  })

  it('uses the generic trame when the candidate has no profileKey', async () => {
    const deps = makeInterviewDeps({
      findById: vi.fn(async () => ({ ...interviewRecord, candidateId: 'c-autre' })),
      findCandidateProfileKey: vi.fn(async () => null),
      findTemplate: vi.fn(async (profileKey: string) =>
        profileKey === 'generique' ? genericTemplate : pharmacienTemplate,
      ),
    })
    const run = await interviewCaller(deps).getRun({ id: 'i1' })
    expect(run?.sections[0]?.questions[0]?.id).toBe('gen_q1')
  })

  it('exposes the dossier checklist on every run', async () => {
    const run = await interviewCaller(makeInterviewDeps()).getRun({ id: 'i1' })
    expect(run?.checklistItems.map((item) => item.id)).toEqual(['cv', 'id_doc', 'vitale', 'diploma'])
  })
})
