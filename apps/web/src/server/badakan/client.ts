import { mapBadakanRecipient, type BadakanRecipient } from './map-recipient'
import { mapBadakanMission, type BadakanMission } from './map-mission'
import { badakanGetRecipient, badakanLogin } from './auth'
import { searchPages } from './paged-search'

export type BadakanClientConfig = {
  baseUrl: string
  email: string
  password: string
  fetchFn?: typeof fetch
}

export type BadakanClient = {
  searchNewEmployees: (pageSize?: number) => Promise<BadakanRecipient[]>
  searchEmployees: (pageSize?: number) => Promise<BadakanRecipient[]>
  searchMissions: (pageSize?: number) => Promise<BadakanMission[]>
  getRecipient: (badakanId: string) => Promise<BadakanRecipient | null>
}

export function createBadakanClient(config: BadakanClientConfig): BadakanClient {
  const fetchFn = config.fetchFn ?? fetch
  const login = () =>
    badakanLogin(config.baseUrl, config.email, config.password, fetchFn)
  const search = <T>(
    path: string,
    pageSize: number,
    failLabel: string,
    mapItem: (raw: unknown) => T | null,
  ) =>
    login().then((token) =>
      searchPages(fetchFn, `${config.baseUrl}${path}`, token, pageSize, failLabel, mapItem),
    )
  return {
    searchNewEmployees: (pageSize = 100) =>
      search(
        '/services/v3/recipients/searchNewEmployees',
        pageSize,
        'Badakan searchNewEmployees',
        mapBadakanRecipient,
      ),
    searchEmployees: (pageSize = 100) =>
      search(
        '/services/v3/recipients/searchEmployees',
        pageSize,
        'Badakan searchEmployees',
        mapBadakanRecipient,
      ),
    searchMissions: (pageSize = 100) =>
      search(
        '/services/v3/missions/search',
        pageSize,
        'Badakan searchMissions',
        mapBadakanMission,
      ),
    async getRecipient(badakanId) {
      const token = await login()
      const raw = await badakanGetRecipient(
        config.baseUrl,
        token,
        badakanId,
        fetchFn,
      )
      return mapBadakanRecipient(raw)
    },
  }
}

export function badakanClientFromEnv(
  env: NodeJS.ProcessEnv = process.env,
  fetchFn?: typeof fetch,
): BadakanClient {
  return createBadakanClient({ ...badakanEnvConfig(env), fetchFn })
}

export function badakanEnvConfig(env: NodeJS.ProcessEnv = process.env) {
  const email = env.BADAKAN_EMAIL
  const password = env.BADAKAN_PASSWORD
  if (!email || !password) throw new Error('BADAKAN_EMAIL / BADAKAN_PASSWORD manquants')
  return {
    baseUrl: env.BADAKAN_API_URL ?? env.BADAKAN_BASE_URL ?? 'https://api.badakan.com/brother-web',
    email,
    password,
  }
}
