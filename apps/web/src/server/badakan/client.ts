import { mapBadakanRecipient, type BadakanRecipient } from './map-recipient'

export type BadakanClientConfig = {
  baseUrl: string
  email: string
  password: string
  fetchFn?: typeof fetch
}

export type BadakanClient = {
  searchNewEmployees: (pageSize?: number) => Promise<BadakanRecipient[]>
}

type LoginBody = { security_token?: string; securityToken?: string; token?: string }

async function login(config: BadakanClientConfig, fetchFn: typeof fetch): Promise<string> {
  const res = await fetchFn(`${config.baseUrl}/accounts/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: config.email, password: config.password }),
  })
  if (!res.ok) throw new Error(`Badakan login failed (${res.status})`)
  const body = (await res.json()) as LoginBody
  const token = body.security_token ?? body.securityToken ?? body.token
  if (!token) throw new Error('Badakan login: missing security token')
  return token
}

function extractList(body: unknown): unknown[] {
  if (Array.isArray(body)) return body
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>
    for (const key of ['content', 'recipients', 'data', 'items', 'results']) {
      if (Array.isArray(record[key])) return record[key] as unknown[]
    }
  }
  return []
}

export function createBadakanClient(config: BadakanClientConfig): BadakanClient {
  const fetchFn = config.fetchFn ?? fetch
  return {
    async searchNewEmployees(pageSize = 100) {
      const token = await login(config, fetchFn)
      const res = await fetchFn(`${config.baseUrl}/recipients/searchNewEmployees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          security_token: token,
        },
        body: JSON.stringify({ pageSize, page: 0 }),
      })
      if (!res.ok) throw new Error(`Badakan searchNewEmployees failed (${res.status})`)
      const body: unknown = await res.json()
      return extractList(body)
        .map(mapBadakanRecipient)
        .filter((row): row is BadakanRecipient => row !== null)
    },
  }
}

export function badakanClientFromEnv(
  env: NodeJS.ProcessEnv = process.env,
  fetchFn?: typeof fetch,
): BadakanClient {
  const email = env.BADAKAN_EMAIL
  const password = env.BADAKAN_PASSWORD
  if (!email || !password) throw new Error('BADAKAN_EMAIL / BADAKAN_PASSWORD manquants')
  return createBadakanClient({
    baseUrl: env.BADAKAN_BASE_URL ?? 'https://api.badakan.com/brother-web',
    email,
    password,
    fetchFn,
  })
}
