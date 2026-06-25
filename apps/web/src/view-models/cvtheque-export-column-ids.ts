import { z } from 'zod'

export const cvthequeExportColumnIds = [
  'lastName',
  'firstName',
  'email',
  'phone',
  'city',
  'postalCode',
  'department',
  'address',
  'mobilityRadiusKm',
  'jobTitle',
  'referent',
  'availability',
  'mobilityNotes',
  'softwares',
  'contractTypes',
  'notes',
  'cvSummary',
  'anonymizedProfile',
  'createdAt',
  'updatedAt',
  'activeMission',
] as const

export type CvthequeExportColumnId = (typeof cvthequeExportColumnIds)[number]

export const cvthequeExportColumnIdSchema = z.enum(cvthequeExportColumnIds)

export const cvthequeDefaultExportColumnIds: CvthequeExportColumnId[] = [
  'lastName',
  'firstName',
  'jobTitle',
  'city',
  'department',
  'referent',
  'availability',
]

export const cvthequeTableColumnIds = [
  'lastName',
  'firstName',
  'jobTitle',
  'city',
  'department',
  'referent',
  'availability',
] as const satisfies readonly CvthequeExportColumnId[]

export type CvthequeTableColumnId = (typeof cvthequeTableColumnIds)[number]
