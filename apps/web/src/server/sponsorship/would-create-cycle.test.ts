import { describe, expect, it } from 'vitest'
import { wouldCreateCycle } from '@/server/sponsorship/would-create-cycle'

describe('wouldCreateCycle', () => {
  it('detects A↔B when linking A under B while B under A', async () => {
    const sponsors = new Map([['b', 'a']])
    const cycle = await wouldCreateCycle('a', 'b', async (id) => sponsors.get(id) ?? null)
    expect(cycle).toBe(true)
  })

  it('detects A→B→C→A', async () => {
    const sponsors = new Map([
      ['b', 'a'],
      ['c', 'b'],
    ])
    const cycle = await wouldCreateCycle('a', 'c', async (id) => sponsors.get(id) ?? null)
    expect(cycle).toBe(true)
  })

  it('allows open chain', async () => {
    const sponsors = new Map([['b', 'a']])
    const cycle = await wouldCreateCycle('c', 'b', async (id) => sponsors.get(id) ?? null)
    expect(cycle).toBe(false)
  })
})
