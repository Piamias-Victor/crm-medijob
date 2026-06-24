export type CandidatsTab = 'cvtheque' | 'inbox'

export function parseCandidatsTab(param: string | null | undefined): CandidatsTab {
  return param === 'inbox' ? 'inbox' : 'cvtheque'
}

export function candidatsPageHref(tab: CandidatsTab = 'cvtheque'): string {
  return tab === 'inbox' ? '/candidats?tab=inbox' : '/candidats'
}

export function buildCandidatsTabHref(tab: CandidatsTab, search: string): string {
  const params = new URLSearchParams(search)
  if (tab === 'inbox') params.set('tab', 'inbox')
  else params.delete('tab')
  const query = params.toString()
  return query ? `/candidats?${query}` : '/candidats'
}

export function candidatsNavHref(inboxPending: number): string {
  return inboxPending > 0 ? candidatsPageHref('inbox') : candidatsPageHref('cvtheque')
}
