export const SOFT_DELETE_ERROR = 'Impossible de supprimer'

export const SOFT_DELETE_IRREVERSIBLE = 'Cette action est irréversible.'

export function softDeleteTitle(entityName: string) {
  return `Supprimer ${entityName} ?`
}
