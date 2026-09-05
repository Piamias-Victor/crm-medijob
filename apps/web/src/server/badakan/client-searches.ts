import { mapBadakanRecipient } from './map-recipient'
import { mapBadakanMission } from './map-mission'
import { mapBadakanContract } from './map-contract'
import { searchPages } from './paged-search'

// Each search endpoint validates order.parameter against its own enum (cf. /v3/api-docs) and
// answers 400 « corps illisible » on any other value.
const ORDER = {
  recipients: 'CREATION_DATE',
  missions: 'EXPECTED_START_DATE',
  contracts: 'START_DATE',
} as const

export function badakanClientSearches(
  login: () => Promise<string>,
  baseUrl: string,
  fetchFn: typeof fetch,
) {
  const run = async <T>(
    path: string,
    orderParameter: string,
    label: string,
    mapItem: (raw: unknown) => T | null,
    pageSize: number,
  ) =>
    searchPages({
      fetchFn,
      url: `${baseUrl}${path}`,
      token: await login(),
      pageSize,
      orderParameter,
      failLabel: `Badakan ${label}`,
      mapItem,
    })

  return {
    searchNewEmployees: (pageSize = 100) =>
      run(
        '/services/v3/recipients/searchNewEmployees',
        ORDER.recipients,
        'searchNewEmployees',
        mapBadakanRecipient,
        pageSize,
      ),
    searchEmployees: (pageSize = 100) =>
      run(
        '/services/v3/recipients/searchEmployees',
        ORDER.recipients,
        'searchEmployees',
        mapBadakanRecipient,
        pageSize,
      ),
    searchMissions: (pageSize = 100) =>
      run(
        '/services/v3/missions/search',
        ORDER.missions,
        'searchMissions',
        mapBadakanMission,
        pageSize,
      ),
    searchContracts: (pageSize = 100) =>
      run(
        '/services/v3/contracts/search',
        ORDER.contracts,
        'searchContracts',
        mapBadakanContract,
        pageSize,
      ),
  }
}
