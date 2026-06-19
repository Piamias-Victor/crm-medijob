import type { DocumentEntityType, Prisma } from '@prisma/client'

export function entityFilter(
  entityType: DocumentEntityType,
  entityId: string,
): Prisma.DocumentWhereInput {
  switch (entityType) {
    case 'PHARMACY':
      return { pharmacyId: entityId }
    case 'CONTACT':
      return { contactId: entityId }
    case 'MISSION':
      return { missionId: entityId }
    case 'CANDIDATE':
      return { candidateId: entityId }
  }
}

export function activityEntityFilter(
  entityType: DocumentEntityType,
  entityId: string,
): Prisma.ActivityLogWhereInput {
  switch (entityType) {
    case 'PHARMACY':
      return { pharmacyId: entityId, entityType }
    case 'CONTACT':
      return { contactId: entityId, entityType }
    case 'MISSION':
      return { missionId: entityId, entityType }
    case 'CANDIDATE':
      return { candidateId: entityId, entityType }
  }
}

export function activityEntityData(
  entityType: DocumentEntityType,
  entityId: string,
): Pick<
  Prisma.ActivityLogUncheckedCreateInput,
  'entityType' | 'candidateId' | 'pharmacyId' | 'contactId' | 'missionId'
> {
  switch (entityType) {
    case 'PHARMACY':
      return { entityType, pharmacyId: entityId }
    case 'CONTACT':
      return { entityType, contactId: entityId }
    case 'MISSION':
      return { entityType, missionId: entityId }
    case 'CANDIDATE':
      return { entityType, candidateId: entityId }
  }
}
