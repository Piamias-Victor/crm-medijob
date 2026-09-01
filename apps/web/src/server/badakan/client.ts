import { mapBadakanRecipient, type BadakanRecipient } from './map-recipient'
import { mapBadakanMission, type BadakanMission } from './map-mission'
import { mapBadakanContract, type BadakanContract } from './map-contract'
import { type BadakanComment } from './map-comment'
import { type BadakanEnterprise } from './map-enterprise'
import { badakanLogin } from './auth'
import { searchPages } from './paged-search'
import { badakanClientGets } from './client-gets'

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
  searchContracts: (pageSize?: number) => Promise<BadakanContract[]>
  getRecipient: (badakanId: string) => Promise<BadakanRecipient | null>
  getComments: (targetId: string) => Promise<BadakanComment[]>
  getEnterprise: (enterpriseId: string) => Promise<BadakanEnterprise | null>
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
    searchContracts: (pageSize = 100) =>
      search(
        '/services/v3/contracts/search',
        pageSize,
        'Badakan searchContracts',
        mapBadakanContract,
      ),
    ...badakanClientGets(login, config.baseUrl, fetchFn),
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
