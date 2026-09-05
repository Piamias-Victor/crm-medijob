import { mapBadakanRecipient } from './map-recipient'
import { mapBadakanComments } from './map-comment'
import { mapBadakanEnterprise } from './map-enterprise'
import {
  badakanGetComments,
  badakanGetEnterprise,
  badakanGetRecipient,
} from './auth'

export function badakanClientGets(
  login: () => Promise<string>,
  baseUrl: string,
  fetchFn: typeof fetch,
) {
  return {
    async getRecipient(badakanId: string) {
      const token = await login()
      return mapBadakanRecipient(
        await badakanGetRecipient(baseUrl, token, badakanId, fetchFn),
      )
    },
    async getComments(targetId: string) {
      const token = await login()
      return mapBadakanComments(
        await badakanGetComments(baseUrl, token, targetId, fetchFn),
      )
    },
    async getEnterprise(enterpriseId: string) {
      const token = await login()
      return mapBadakanEnterprise(
        await badakanGetEnterprise(baseUrl, token, enterpriseId, fetchFn),
      )
    },
  }
}
