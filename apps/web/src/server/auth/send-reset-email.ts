import { TRPCError } from '@trpc/server'
import { RESET_EMAIL_SUBJECT, resetEmailHtml } from './reset-email-copy'

export type SendResetEmailInput = {
  email: string
  resetUrl: string
}

export type ResetMailerEnv = {
  RESEND_API_KEY?: string
  RESEND_FROM?: string
}

export type SendResetEmailDeps = {
  fetchFn?: typeof fetch
  env?: ResetMailerEnv
}

const RESEND_EMAILS_URL = 'https://api.resend.com/emails'

function mailerConfig(env: ResetMailerEnv) {
  const apiKey = env.RESEND_API_KEY?.trim()
  const from = env.RESEND_FROM?.trim()
  if (!apiKey || !from) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Envoi email indisponible',
    })
  }
  return { apiKey, from }
}

/** Sends the reset link via Resend. Never logs the raw token or URL. */
export async function sendResetEmail(
  input: SendResetEmailInput,
  deps: SendResetEmailDeps = {},
): Promise<void> {
  const { apiKey, from } = mailerConfig({
    RESEND_API_KEY: deps.env?.RESEND_API_KEY ?? process.env.RESEND_API_KEY,
    RESEND_FROM: deps.env?.RESEND_FROM ?? process.env.RESEND_FROM,
  })
  const fetchFn = deps.fetchFn ?? fetch
  const res = await fetchFn(RESEND_EMAILS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject: RESET_EMAIL_SUBJECT,
      html: resetEmailHtml(input.resetUrl),
    }),
  })
  if (!res.ok) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Envoi email indisponible',
    })
  }
}
