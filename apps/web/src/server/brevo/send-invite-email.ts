import type { InviteEmailInput } from '@/server/app-profile/invite-due.types'

export type BrevoEnv = {
  BREVO_API_KEY?: string
  BREVO_SENDER?: string
  BREVO_TEMPLATE_ID?: string
}

export type SendInviteEmailDeps = {
  fetchFn?: typeof fetch
  env?: BrevoEnv
}

function brevoConfig(env: BrevoEnv) {
  const apiKey = env.BREVO_API_KEY?.trim()
  const sender = env.BREVO_SENDER?.trim()
  const templateId = Number(env.BREVO_TEMPLATE_ID?.trim())
  if (!apiKey || !sender || !Number.isInteger(templateId) || templateId <= 0) {
    throw new Error('Envoi email indisponible')
  }
  return { apiKey, sender, templateId }
}

export async function sendHireflixInviteEmail(
  input: InviteEmailInput,
  deps: SendInviteEmailDeps = {},
): Promise<void> {
  const { apiKey, sender, templateId } = brevoConfig({
    BREVO_API_KEY: deps.env?.BREVO_API_KEY ?? process.env.BREVO_API_KEY,
    BREVO_SENDER: deps.env?.BREVO_SENDER ?? process.env.BREVO_SENDER,
    BREVO_TEMPLATE_ID: deps.env?.BREVO_TEMPLATE_ID ?? process.env.BREVO_TEMPLATE_ID,
  })
  const fetchFn = deps.fetchFn ?? fetch
  const res = await fetchFn('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    cache: 'no-store',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { email: sender, name: 'MediJob' },
      to: [{ email: input.to, name: input.firstName }],
      templateId,
      params: { PRENOM: input.firstName, HIREFLIX_URL: input.url },
    }),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Envoi email indisponible (${res.status}) ${detail.slice(0, 200)}`)
  }
}
