import { toContactMissionRows } from '@/view-models/contact-detail'
import type { ContactMissionEntity } from '@/view-models/contact-detail.types'

type ContactMissionReader = {
  listByContact: (contactId: string) => Promise<ContactMissionEntity[]>
}

export async function listContactMissions(
  contactId: string,
  reader: ContactMissionReader,
): Promise<ReturnType<typeof toContactMissionRows>> {
  return toContactMissionRows(await reader.listByContact(contactId))
}

export function makeContactMissionReader(
  listByContact: ContactMissionReader['listByContact'],
): ContactMissionReader {
  return { listByContact }
}
