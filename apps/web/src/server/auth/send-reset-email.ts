import { TRPCError } from '@trpc/server'
import { RESET_EMAIL_SUBJECT, resetEmailHtml } from './reset-email-copy'

export type SendResetEmailInput = {
  email: string
  resetUrl: string
}

export type ResetMailerEnv = {
  BREVO_API_KEY?: string
  BREVO_SENDER?: string
}

export type SendResetEmailDeps = {
  fetchFn?: typeof fetch
  env?: ResetMailerEnv
}

const BREVO_SMTP_URL = 'https://api.brevo.com/v3/smtp/email'

function mailerConfig(env: ResetMailerEnv) {
  const apiKey = env.BREVO_API_KEY?.trim()
  const sender = env.BREVO_SENDER?.trim()
  if (!apiKey || !sender) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Envoi email indisponible',
    })
  }
  return { apiKey, sender }
}

/** Sends the reset link via Brevo transactional email. Never logs the raw token or URL. */
export async function sendResetEmail(
  input: SendResetEmailInput,
  deps: SendResetEmailDeps = {},
): Promise<void> {
  const { apiKey, sender } = mailerConfig({
    BREVO_API_KEY: deps.env?.BREVO_API_KEY ?? process.env.BREVO_API_KEY,
    BREVO_SENDER: deps.env?.BREVO_SENDER ?? process.env.BREVO_SENDER,
  })
  const fetchFn = deps.fetchFn ?? fetch
  const res = await fetchFn(BREVO_SMTP_URL, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { email: sender, name: 'MediJob' },
      to: [{ email: input.email }],
      subject: RESET_EMAIL_SUBJECT,
      htmlContent: resetEmailHtml(input.resetUrl),
    }),
  })
  if (!res.ok) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Envoi email indisponible',
    })
  }
}
