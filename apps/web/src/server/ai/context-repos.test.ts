import { describe, it, expect } from 'vitest'
import { loadContextText } from '@/server/ai/context-loader'
import { makeAssistantContextRepos } from '@/server/ai/context-repos.adapter'

describe('assistant context repos', () => {
  it('formats mission with contract and salary fields from context reader', async () => {
    const repos = makeAssistantContextRepos({
      mission: {
        findForContext: async () => ({
          title: 'CDD Préparateur',
          contractType: 'CDD',
          startDate: new Date('2026-07-01'),
          salaireMin: 2200,
          salaireMax: 2500,
          notes: 'Urgent',
        }),
      },
    })
    const text = await loadContextText(
      { entityType: 'mission', entityId: 'm1' },
      repos,
    )
    expect(text).toContain('CDD Préparateur')
    expect(text).toContain('2200')
  })
})
