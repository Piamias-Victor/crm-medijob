import { describe, expect, it, vi } from 'vitest'
import { makeJobTitleRepository } from './job-title.repository'

describe('jobTitleRepository findIdByNameInsensitive', () => {
  it('returns the JobTitle id when the name matches ignoring case', async () => {
    const db = {
      jobTitle: {
        findFirst: vi.fn().mockResolvedValue({ id: 'jt-prep' }),
      },
    }
    const repo = makeJobTitleRepository(db as never)
    await expect(repo.findIdByNameInsensitive('préparateur')).resolves.toBe('jt-prep')
    expect(db.jobTitle.findFirst).toHaveBeenCalledWith({
      where: { name: { equals: 'préparateur', mode: 'insensitive' } },
      select: { id: true },
    })
  })

  it('returns null when no JobTitle matches', async () => {
    const db = {
      jobTitle: { findFirst: vi.fn().mockResolvedValue(null) },
    }
    const repo = makeJobTitleRepository(db as never)
    await expect(repo.findIdByNameInsensitive('inconnu')).resolves.toBeNull()
  })
})
