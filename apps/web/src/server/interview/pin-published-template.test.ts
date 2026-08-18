import { describe, expect, it } from 'vitest'
import { pinPublishedTemplateId } from '@/server/interview/pin-published-template'
import { INTERVIEW_GENERIC_PROFILE_KEY } from '@/view-models/interview-profile-key'

const templates: Record<string, { id: string }> = {
  pharmacien: { id: 'tpl-p' },
  [INTERVIEW_GENERIC_PROFILE_KEY]: { id: 'tpl-g' },
}

describe('pinPublishedTemplateId', () => {
  it('pins the dedicated published trame when the pair is active', async () => {
    const id = await pinPublishedTemplateId('c1', 'INTERIM', {
      findCandidateProfileKey: async () => 'pharmacien',
      findPublishedTemplate: async (key) => templates[key] ?? null,
      isPairArchived: async () => false,
    })
    expect(id).toBe('tpl-p')
  })

  it('pins the generic trame when the dedicated pair is archived', async () => {
    const id = await pinPublishedTemplateId('c1', 'INTERIM', {
      findCandidateProfileKey: async () => 'pharmacien',
      findPublishedTemplate: async (key) => templates[key] ?? null,
      isPairArchived: async () => true,
    })
    expect(id).toBe('tpl-g')
  })
})
