export const ACTIVITY_LOG_CREATED_CONTENT = 'Fiche créée'

export const ACTIVITY_LOG_UPDATED_PREFIX = 'Fiche modifiée par'

export const ACTIVITY_LOG_DEFAULT_AUTHOR_LABEL = 'Utilisateur'

export function activityLogUpdatedContent(authorLabel: string): string {
  return `${ACTIVITY_LOG_UPDATED_PREFIX} ${authorLabel}`
}

export function resolveAuthorLabel(user: {
  name?: string | null
  email?: string | null
}): string {
  const name = user.name?.trim()
  if (name) return name
  const email = user.email?.trim()
  if (email) return email
  return ACTIVITY_LOG_DEFAULT_AUTHOR_LABEL
}
