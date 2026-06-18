import { missionRepository } from '@/server/db/repositories/mission.repository'
import { listContactMissions, makeContactMissionReader } from '@/server/read-models/contact-missions'

const reader = makeContactMissionReader((contactId) => missionRepository.listByContact(contactId))

export function loadContactMissions(contactId: string) {
  return listContactMissions(contactId, reader)
}
