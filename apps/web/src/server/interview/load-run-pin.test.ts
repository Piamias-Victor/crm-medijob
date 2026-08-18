import { describe, expect, it } from 'vitest'
import { loadInterviewRun } from '@/server/interview/load-run'
import type { InterviewRecord } from '@/view-models/interview-list'

const draft: InterviewRecord = {
  id: 'i1',
  candidateId: 'c1',
  status: 'DRAFT',
  mode: 'INTERIM',
  decision: null,
  createdAt: new Date('2026-08-17T10:00:00Z'),
  templateId: 'tpl-v1',
}

const pinned = {
  label: 'Pharmacien v1',
  sections: [
    {
      id: 's1',
      title: 'Ancienne grille',
      questions: [{ id: 'old_q', question: 'Question v1 ?', suggestedAnswers: [{ label: 'Oui', text: 'Oui' }] }],
    },
  ],
}

const latest = {
  label: 'Pharmacien v2',
  sections: [
    {
      id: 's1',
      title: 'Nouvelle grille',
      questions: [{ id: 'new_q', question: 'Question v2 ?', suggestedAnswers: [{ label: 'Oui', text: 'Oui' }] }],
    },
  ],
}

describe('loadInterviewRun pin', () => {
  it('keeps the pinned trame when a newer version is published', async () => {
    const run = await loadInterviewRun('i1', {
      findById: async () => draft,
      findCandidateProfileKey: async () => 'pharmacien',
      findTemplate: async () => latest,
      findTemplateById: async (id) => (id === 'tpl-v1' ? pinned : latest),
    })
    expect(run?.templateLabel).toBe('Pharmacien v1')
    expect(run?.sections[0]?.questions[0]?.id).toBe('old_q')
  })

  it('falls back to the latest published trame when the DRAFT has no pin', async () => {
    const run = await loadInterviewRun('i1', {
      findById: async () => ({ ...draft, templateId: null }),
      findCandidateProfileKey: async () => 'pharmacien',
      findTemplate: async () => latest,
      findTemplateById: async () => pinned,
    })
    expect(run?.sections[0]?.questions[0]?.id).toBe('new_q')
  })
})
