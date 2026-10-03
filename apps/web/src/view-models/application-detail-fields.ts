import {
  applicationOfferLabel,
  formatInboxDate,
  type InboxItem,
} from '@/view-models/application-inbox'
import { applicationSourceLabel } from '@/view-models/application-source.labels'
import type { DetailField } from '@/components/molecules/DetailFieldList'

export function applicationDetailFields(item: InboxItem): DetailField[] {
  return [
    { label: 'Prénom', value: item.firstName },
    { label: 'Nom', value: item.lastName },
    { label: 'Métier', value: item.jobTitle?.name },
    { label: 'Téléphone', value: item.phone },
    { label: 'Email', value: item.email },
    { label: 'Ville', value: item.city },
    { label: 'Code postal', value: item.postalCode },
    { label: 'Source', value: applicationSourceLabel(item.source) },
    { label: 'Offre', value: applicationOfferLabel(item) },
    { label: 'Reçue le', value: formatInboxDate(item.createdAt) },
    { label: 'Message', value: item.message },
  ]
}
