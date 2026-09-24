import { describe, expect, it, vi } from 'vitest'
import { ignoreAppProfile, AppProfileError } from './accept'

const pending = { id: 'p1', status: 'EN_ATTENTE', badakanId: 'bk1' }

describe('ignoreAppProfile', () => {
  it('marks pending profile IGNORE', async () => {
    const markStatus = vi.fn()
    await ignoreAppProfile('p1', {
      findById: async () => pending,
      markStatus,
    })
    expect(markStatus).toHaveBeenCalledWith('p1', 'IGNORE')
  })

  it('rejects non-pending', async () => {
    await expect(
      ignoreAppProfile('p1', {
        findById: async () => ({ ...pending, status: 'IGNORE' }),
        markStatus: vi.fn(),
      }),
    ).rejects.toBeInstanceOf(AppProfileError)
  })
})
