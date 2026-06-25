export const GMAIL_COMPOSE_MAX_BODY_CHARS = 500
export const GMAIL_COMPOSE_MAX_BCC_CHARS = 1500

export function isComposeBccTooLong(bcc?: string) {
  return (bcc?.trim().length ?? 0) > GMAIL_COMPOSE_MAX_BCC_CHARS
}
