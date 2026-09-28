import { ENTREES_APP_HREF } from './candidats-tab'

export function applicationDetailPath(id: string) {
  return `/candidats/candidatures/${id}`
}

export function applicationConvertPath(id: string) {
  return `/candidats/candidatures/${id}/convert`
}

export function appProfileDetailPath(_id: string) {
  return ENTREES_APP_HREF
}

export function appProfileConvertPath(_id: string) {
  return ENTREES_APP_HREF
}
