import type { CandidateExportSort } from '@/view-models/candidate-export.schema'
import {
  cvthequeExportColumnIds,
  type CvthequeExportColumnId,
} from '@/view-models/cvtheque-export-column-ids'

export type CvthequeExportColumnGroup = {
  label: string
  columnIds: CvthequeExportColumnId[]
}

export const cvthequeExportColumnGroups: CvthequeExportColumnGroup[] = [
  {
    label: 'Identité',
    columnIds: ['lastName', 'firstName', 'email', 'phone'],
  },
  {
    label: 'Localisation',
    columnIds: ['city', 'postalCode', 'department', 'address', 'mobilityRadiusKm'],
  },
  {
    label: 'Métier / CRM',
    columnIds: ['jobTitle', 'referent', 'availability', 'mobilityNotes'],
  },
  {
    label: 'Préférences',
    columnIds: ['softwares', 'contractTypes'],
  },
  {
    label: 'Profil',
    columnIds: ['notes', 'cvSummary', 'anonymizedProfile'],
  },
  {
    label: 'Meta',
    columnIds: ['createdAt', 'updatedAt'],
  },
  {
    label: 'Mission',
    columnIds: ['activeMission'],
  },
]

export const cvthequeExportColumnHeaders: Record<CvthequeExportColumnId, string> = {
  lastName: 'Nom',
  firstName: 'Prénom',
  email: 'Email',
  phone: 'Téléphone',
  city: 'Ville',
  postalCode: 'Code postal',
  department: 'Département',
  address: 'Adresse',
  mobilityRadiusKm: 'Rayon mobilité (km)',
  jobTitle: 'Métier',
  referent: 'Référent',
  availability: 'Disponibilité',
  mobilityNotes: 'Notes mobilité',
  softwares: 'LGO',
  contractTypes: 'Types contrat',
  notes: 'Notes',
  cvSummary: 'Résumé CV',
  anonymizedProfile: 'Profil anonymisé',
  createdAt: 'Date création',
  updatedAt: 'Date MAJ',
  activeMission: 'Mission active',
}

export function cvthequeExportHeaders(columnIds: CvthequeExportColumnId[]): string[] {
  return columnIds.map((id) => cvthequeExportColumnHeaders[id])
}

export function orderExportColumnIds(columnIds: CvthequeExportColumnId[]): CvthequeExportColumnId[] {
  return cvthequeExportColumnIds.filter((id) => columnIds.includes(id))
}

export function resolveCandidateExportColumnIds(
  columnIds: CvthequeExportColumnId[],
  sort?: CandidateExportSort | null,
): CvthequeExportColumnId[] {
  const merged = new Set<CvthequeExportColumnId>(['firstName', 'lastName', ...columnIds])
  if (sort) merged.add(sort.columnId)
  return orderExportColumnIds([...merged])
}
