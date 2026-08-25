import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { DetailField } from '@/components/molecules/DetailFieldList'

export function appProfileDetailFields(item: AppProfileListItem): DetailField[] {
  return [
    { label: 'Prénom', value: item.firstName },
    { label: 'Nom', value: item.lastName },
    { label: 'Métier', value: item.jobTitleName ?? item.activityLabel },
    { label: 'Téléphone', value: item.phone },
    { label: 'Email', value: item.email },
    { label: 'Invitation', value: item.invitationLabel },
    { label: 'Ville', value: item.city },
    { label: 'Code postal', value: item.postalCode },
    { label: 'Adresse', value: item.address },
  ]
}
