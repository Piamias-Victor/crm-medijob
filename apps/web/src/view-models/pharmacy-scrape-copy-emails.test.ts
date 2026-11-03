import { describe, expect, it } from 'vitest'
import { formatScrapeEmailsForClipboard } from '@/view-models/pharmacy-scrape-copy-emails'

describe('formatScrapeEmailsForClipboard', () => {
  it('dedupes emails and joins with semicolon for Brevo / mail classique', () => {
    expect(
      formatScrapeEmailsForClipboard([
        { email: 'b@ex.com' },
        { email: 'a@ex.com' },
        { email: 'b@ex.com' },
      ]),
    ).toBe('a@ex.com; b@ex.com')
  })

  it('returns empty string when there are no emails', () => {
    expect(formatScrapeEmailsForClipboard([])).toBe('')
  })
})
