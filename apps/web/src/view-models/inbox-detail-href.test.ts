import { describe, expect, it } from 'vitest'
import {
  appProfileConvertPath,
  appProfileDetailPath,
} from './inbox-detail-href'
import { ENTREES_APP_HREF } from './candidats-tab'

describe('inbox-detail-href app profile legacy', () => {
  it('routes detail and convert to Entrées app', () => {
    expect(appProfileDetailPath('any')).toBe(ENTREES_APP_HREF)
    expect(appProfileConvertPath('any')).toBe(ENTREES_APP_HREF)
  })
})
