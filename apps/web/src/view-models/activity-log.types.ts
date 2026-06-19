export const DOCUMENT_ENTITY_TYPES = ['PHARMACY', 'CONTACT', 'MISSION', 'CANDIDATE'] as const

export type DocumentEntityTypeValue = (typeof DOCUMENT_ENTITY_TYPES)[number]

export type ActivityLogScope = {
  entityType: DocumentEntityTypeValue
  entityId: string
}
