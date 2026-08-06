export type CandidatsTab = 'cvtheque' | 'inbox' | 'app-profiles'

export function parseCandidatsTab(param: string | null | undefined): CandidatsTab {
  if (param === 'inbox') return 'inbox'
  if (param === 'app-profiles') return 'app-profiles'
  return 'cvtheque'
}

export function candidatsPageHref(tab: CandidatsTab = 'cvtheque'): string {
  if (tab === 'inbox') return '/candidats?tab=inbox'
  if (tab === 'app-profiles') return '/candidats?tab=app-profiles'
  return '/candidats'
}

export function buildCandidatsTabHref(tab: CandidatsTab, search: string): string {
  const params = new URLSearchParams(search)
  if (tab === 'cvtheque') params.delete('tab')
  else params.set('tab', tab)
  const query = params.toString()
  return query ? `/candidats?${query}` : '/candidats'
}

export function candidatsNavHref(inboxPending: number): string {
  return inboxPending > 0 ? candidatsPageHref('inbox') : candidatsPageHref('cvtheque')
}
