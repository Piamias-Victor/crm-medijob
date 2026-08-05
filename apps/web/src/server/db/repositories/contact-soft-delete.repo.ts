import { NOT_DELETED } from './soft-delete'
import { PrimaryContactSoftDeleteError } from './contact-soft-delete'

type SoftDeleteDb = {
  contact: {
    findFirst: (args: {
      where: { id: string; deletedAt: null }
      select: { isPrimary: true }
    }) => Promise<{ isPrimary: boolean } | null>
    update: (args: {
      where: { id: string }
      data: { deletedAt: Date }
    }) => Promise<unknown>
  }
}

export async function softDeleteContact(db: SoftDeleteDb, id: string) {
  const contact = await db.contact.findFirst({
    where: { id, ...NOT_DELETED },
    select: { isPrimary: true },
  })
  if (!contact) return null
  if (contact.isPrimary) throw new PrimaryContactSoftDeleteError()
  return db.contact.update({ where: { id }, data: { deletedAt: new Date() } })
}
