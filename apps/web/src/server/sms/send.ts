export type SmsInput = { to: string; content: string }

export type SmsEnv = {
  BREVO_API_KEY?: string
  BREVO_SMS_SENDER?: string
}

export type SendSmsDeps = {
  fetchFn?: typeof fetch
  env?: SmsEnv
}

function smsConfig(env: SmsEnv) {
  const apiKey = env.BREVO_API_KEY?.trim()
  const sender = env.BREVO_SMS_SENDER?.trim()
  if (!apiKey || !sender) throw new Error('Envoi SMS indisponible')
  return { apiKey, sender }
}

export async function sendAvailabilitySms(
  input: SmsInput,
  deps: SendSmsDeps = {},
): Promise<void> {
  const { apiKey, sender } = smsConfig({
    BREVO_API_KEY: deps.env?.BREVO_API_KEY ?? process.env.BREVO_API_KEY,
    BREVO_SMS_SENDER: deps.env?.BREVO_SMS_SENDER ?? process.env.BREVO_SMS_SENDER,
  })
  const fetchFn = deps.fetchFn ?? fetch
  const res = await fetchFn('https://api.brevo.com/v3/transactionalSMS/sms', {
    method: 'POST',
    cache: 'no-store',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender,
      recipient: input.to,
      content: input.content,
    }),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Envoi SMS indisponible (${res.status}) ${detail.slice(0, 200)}`)
  }
}
