// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { softDeleteContact } from './contact-soft-delete.repo'
import { PrimaryContactSoftDeleteError } from './contact-soft-delete'

function makeDb(contact: { isPrimary: boolean } | null) {
  return {
    contact: {
      findFirst: vi.fn().mockResolvedValue(contact),
      update: vi.fn().mockResolvedValue({ id: 'c1', deletedAt: new Date() }),
    },
  }
}

describe('softDeleteContact', () => {
  it('refuses soft-delete of a primary contact', async () => {
    const db = makeDb({ isPrimary: true })
    await expect(softDeleteContact(db, 'c1')).rejects.toBeInstanceOf(PrimaryContactSoftDeleteError)
    expect(db.contact.update).not.toHaveBeenCalled()
  })

  it('soft-deletes a non-primary contact', async () => {
    const db = makeDb({ isPrimary: false })
    await expect(softDeleteContact(db, 'c1')).resolves.toMatchObject({ id: 'c1' })
    expect(db.contact.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { deletedAt: expect.any(Date) },
    })
  })
})
