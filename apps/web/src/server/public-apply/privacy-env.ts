const PLACEHOLDER = '[À COMPLÉTER]'

export function getPublicApplyPrivacyUrl() {
  return process.env.PUBLIC_APPLY_PRIVACY_URL?.trim() || PLACEHOLDER
}

export function getPublicApplyRetentionLabel() {
  return process.env.PUBLIC_APPLY_RETENTION_LABEL?.trim() || PLACEHOLDER
}

export function assertPublicApplyPrivacyEnv() {
  if (process.env.NODE_ENV !== 'production') return
  if (!process.env.PUBLIC_APPLY_PRIVACY_URL?.trim()) {
    throw new Error('PUBLIC_APPLY_PRIVACY_URL is required in production')
  }
  if (!process.env.PUBLIC_APPLY_RETENTION_LABEL?.trim()) {
    throw new Error('PUBLIC_APPLY_RETENTION_LABEL is required in production')
  }
}
