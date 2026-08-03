import { contactRepository } from '@/server/db/repositories/contact.repository'
import { contactRoleRepository } from '@/server/db/repositories/contact-role.repository'
import { findContactQuickViewById } from '@/server/db/repositories/contact-quick-view.repo'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import { listContactMissions } from '@/server/read-models/contact-missions'
import { listPharmacyPickerOptions } from '@/server/read-models/pharmacy-picker'
import { defaultLogLifecycle } from '@/server/activity-log/default-lifecycle'
import { makeContactRouter } from '@/server/routers/contact'

export const contactRouter = makeContactRouter({
  contacts: {
    ...contactRepository,
    findQuickViewById: (id) => findContactQuickViewById(id),
  },
  listMissions: (contactId) =>
    listContactMissions(contactId, {
      listByContact: (id) => missionRepository.listByContact(id),
    }),
  pharmacies: { listForPicker: listPharmacyPickerOptions },
  contactRoles: { list: () => contactRoleRepository.list() },
  logLifecycle: defaultLogLifecycle,
})
