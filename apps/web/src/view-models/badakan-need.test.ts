// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { isOpenNeed, staffingGapLabel } from './badakan-need'

describe('isOpenNeed', () => {
  it('is open when fewer people are staffed than expected', () => {
    expect(isOpenNeed({ expectedRecipients: 2, staffedRecipients: 1 })).toBe(true)
    expect(isOpenNeed({ expectedRecipients: 1, staffedRecipients: 0 })).toBe(true)
  })

  it('is closed when the mission is fully staffed or asks for nobody', () => {
    expect(isOpenNeed({ expectedRecipients: 1, staffedRecipients: 1 })).toBe(false)
    expect(isOpenNeed({ expectedRecipients: 0, staffedRecipients: 0 })).toBe(false)
  })
})

describe('staffingGapLabel', () => {
  it('spells out how many seats remain', () => {
    expect(staffingGapLabel({ expectedRecipients: 2, staffedRecipients: 0 })).toBe('0/2 pourvus')
    expect(staffingGapLabel({ expectedRecipients: 2, staffedRecipients: 1 })).toBe('1/2 pourvus')
  })
})
