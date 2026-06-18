import { describe, it, expect } from 'vitest'
import {
  isTerminalMissionStatus,
  isTerminalStageName,
} from '@/lib/kanban-terminal'

describe('kanban-terminal', () => {
  it('detects terminal mission statuses', () => {
    expect(isTerminalMissionStatus('POURVU')).toBe(true)
    expect(isTerminalMissionStatus('EN_RECHERCHE')).toBe(false)
  })

  it('detects terminal pipeline stage names', () => {
    expect(isTerminalStageName('Pas retenu')).toBe(true)
    expect(isTerminalStageName('Nouveau')).toBe(false)
  })
})
