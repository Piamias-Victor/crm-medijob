import { describe, it, expect } from 'vitest'
import { pipelineStageTheme } from '@/view-models/pipeline-stage-theme'

describe('pipelineStageTheme', () => {
  it('cycles pastel themes by position', () => {
    expect(pipelineStageTheme(0).dot).toContain('primary')
    expect(pipelineStageTheme(1).dot).toContain('accent')
    expect(pipelineStageTheme(6).dot).toContain('primary')
  })
})
