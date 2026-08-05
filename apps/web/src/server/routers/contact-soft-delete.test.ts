// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { contactCaller, makeContactDeps, directionSession } from '@/server/routers/contact.test.fixtures'
import {
  PRIMARY_CONTACT_SOFT_DELETE_MESSAGE,
  PrimaryContactSoftDeleteError,
} from '@/server/db/repositories/contact-soft-delete'

describe('contactRouter softDelete', () => {
  it('soft-deletes for Direction and maps primary guard', async () => {
    const deps = makeContactDeps()
    await contactCaller(deps, directionSession).softDelete({ id: 'c1' })
    expect(deps.contacts.softDelete).toHaveBeenCalledWith('c1')

    const blocked = makeContactDeps({
      contacts: {
        ...makeContactDeps().contacts,
        softDelete: vi.fn().mockRejectedValue(new PrimaryContactSoftDeleteError()),
      },
    })
    await expect(contactCaller(blocked, directionSession).softDelete({ id: 'c1' })).rejects.toMatchObject({
      code: 'PRECONDITION_FAILED',
      message: PRIMARY_CONTACT_SOFT_DELETE_MESSAGE,
    })
  })

  it('forbids soft delete for Recruteur', async () => {
    await expect(contactCaller(makeContactDeps()).softDelete({ id: 'c1' })).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
  })
})
