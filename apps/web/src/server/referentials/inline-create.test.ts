import { describe, it, expect, vi } from 'vitest'
import { createInlineReferential } from '@/server/referentials/inline-create'

describe('createInlineReferential', () => {
  it('creates groupement via referential module', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'g1', name: 'Giphar' })
    const inline = createInlineReferential({ createGroupement: create, createSoftware: vi.fn() })
    await expect(inline.createGroupement('Giphar')).resolves.toEqual({ id: 'g1', name: 'Giphar' })
    expect(create).toHaveBeenCalledWith('Giphar')
  })
})
