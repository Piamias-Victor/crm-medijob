export type PharmacyContractEmailInput = {
  to: string[]
  firstName: string
}

export type PharmacyContractEmailEnv = {
  BREVO_API_KEY?: string
  BREVO_SENDER?: string
  BREVO_PHARMACY_CONTRACT_TEMPLATE_ID?: string
}

export type SendPharmacyContractEmailDeps = {
  fetchFn?: typeof fetch
  env?: PharmacyContractEmailEnv
}

function brevoConfig(env: PharmacyContractEmailEnv) {
  const apiKey = env.BREVO_API_KEY?.trim()
  const sender = env.BREVO_SENDER?.trim()
  const templateId = Number(env.BREVO_PHARMACY_CONTRACT_TEMPLATE_ID?.trim())
  if (!apiKey || !sender || !Number.isInteger(templateId) || templateId <= 0) {
    throw new Error('Envoi email indisponible')
  }
  return { apiKey, sender, templateId }
}

async function postJson(
  fetchFn: typeof fetch,
  url: string,
  apiKey: string,
  body: unknown,
) {
  const res = await fetchFn(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Envoi email indisponible (${res.status}) ${detail.slice(0, 200)}`)
  }
}

export async function sendPharmacyContractEmail(
  input: PharmacyContractEmailInput,
  deps: SendPharmacyContractEmailDeps = {},
): Promise<void> {
  const { apiKey, sender, templateId } = brevoConfig({
    BREVO_API_KEY: deps.env?.BREVO_API_KEY ?? process.env.BREVO_API_KEY,
    BREVO_SENDER: deps.env?.BREVO_SENDER ?? process.env.BREVO_SENDER,
    BREVO_PHARMACY_CONTRACT_TEMPLATE_ID:
      deps.env?.BREVO_PHARMACY_CONTRACT_TEMPLATE_ID ??
      process.env.BREVO_PHARMACY_CONTRACT_TEMPLATE_ID,
  })
  const fetchFn = deps.fetchFn ?? fetch
  for (const email of input.to) {
    await postJson(fetchFn, 'https://api.brevo.com/v3/contacts', apiKey, {
      email,
      attributes: { PRENOM: input.firstName },
      updateEnabled: true,
    })
  }
  await postJson(fetchFn, 'https://api.brevo.com/v3/smtp/email', apiKey, {
    sender: { email: sender, name: 'MediJob' },
    to: input.to.map((email) => ({ email })),
    templateId,
  })
}
