import type { Prisma } from '@prisma/client'
import { KANBAN_MISSIONS_LIMIT } from '@/lib/kanban-limits'
import type { CvthequeExportColumnId } from '@/view-models/cvtheque-export-column-ids'

const REQUIRED_FIELDS = ['firstName', 'lastName'] as const satisfies readonly CvthequeExportColumnId[]

const SCALAR_COLUMN_FIELDS: Partial<Record<CvthequeExportColumnId, keyof Prisma.CandidateSelect>> = {
  lastName: 'lastName',
  firstName: 'firstName',
  email: 'email',
  phone: 'phone',
  city: 'city',
  postalCode: 'postalCode',
  department: 'postalCode',
  address: 'address',
  mobilityRadiusKm: 'mobilityRadiusKm',
  mobilityNotes: 'mobilityNotes',
  availability: 'availableFrom',
  notes: 'notes',
  cvSummary: 'cvSummary',
  anonymizedProfile: 'anonymizedProfile',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
}

function applyRelationSelect(select: Prisma.CandidateSelect, columnId: CvthequeExportColumnId) {
  if (columnId === 'jobTitle') select.jobTitle = { select: { name: true } }
  if (columnId === 'referent') select.referent = { select: { name: true } }
  if (columnId === 'softwares') {
    select.softwares = { select: { software: { select: { name: true } } } }
  }
  if (columnId === 'contractTypes') {
    select.contractPreferences = { select: { contractType: true } }
  }
  if (columnId === 'activeMission') {
    select.missions = {
      take: KANBAN_MISSIONS_LIMIT,
      select: {
        stage: { select: { name: true } },
        mission: { select: { title: true, status: true } },
      },
    }
  }
}

export function buildCandidateExportSelect(columnIds: CvthequeExportColumnId[]): Prisma.CandidateSelect {
  const select: Prisma.CandidateSelect = {}

  for (const columnId of [...REQUIRED_FIELDS, ...columnIds]) {
    const scalarField = SCALAR_COLUMN_FIELDS[columnId]
    if (scalarField) {
      select[scalarField] = true
      continue
    }
    applyRelationSelect(select, columnId)
  }

  return select
}
