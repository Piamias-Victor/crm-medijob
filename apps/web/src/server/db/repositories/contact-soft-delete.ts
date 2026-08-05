export const PRIMARY_CONTACT_SOFT_DELETE_MESSAGE =
  'Désignez un autre contact primaire avant de supprimer celui-ci.'

export class PrimaryContactSoftDeleteError extends Error {
  constructor() {
    super(PRIMARY_CONTACT_SOFT_DELETE_MESSAGE)
    this.name = 'PrimaryContactSoftDeleteError'
  }
}
