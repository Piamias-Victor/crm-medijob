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

type LoginBody = {
  securityToken?: string
  security_token?: string
  token?: string
}

async function login(config: BadakanClientConfig, fetchFn: typeof fetch): Promise<string> {
  const res = await fetchFn(`${config.baseUrl}/services/v3/accounts/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: config.email, password: config.password }),
  })
  if (!res.ok) throw new Error(`Badakan login failed (${res.status})`)
  const body = (await res.json()) as LoginBody
  const token = body.securityToken ?? body.security_token ?? body.token
  if (!token) throw new Error('Badakan login: missing securityToken')
  return token
}

type PageListing = { content?: unknown[]; totalPages?: number }

export function createBadakanClient(config: BadakanClientConfig): BadakanClient {
  const fetchFn = config.fetchFn ?? fetch
  return {
    async searchNewEmployees(pageSize = 100) {
      const token = await login(config, fetchFn)
      const rows: BadakanRecipient[] = []
      for (let pageNumber = 0; pageNumber < 50; pageNumber++) {
        const res = await fetchFn(
          `${config.baseUrl}/services/v3/recipients/searchNewEmployees`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              security_token: token,
            },
            body: JSON.stringify({
              order: { descending: true, parameter: 'CREATION_DATE' },
              page: { pageNumber, pageSize },
            }),
          },
        )
        if (!res.ok) throw new Error(`Badakan searchNewEmployees failed (${res.status})`)
        const body = (await res.json()) as PageListing
        const chunk = body.content ?? []
        for (const raw of chunk) {
          const mapped = mapBadakanRecipient(raw)
          if (mapped) rows.push(mapped)
        }
        if (pageNumber + 1 >= (body.totalPages ?? 1) || chunk.length === 0) break
      }
      return rows
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
    baseUrl: env.BADAKAN_API_URL ?? env.BADAKAN_BASE_URL ?? 'https://api.badakan.com/brother-web',
    email,
    password,
    fetchFn,
  })
}
