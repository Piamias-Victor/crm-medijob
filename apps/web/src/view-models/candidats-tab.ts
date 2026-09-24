export type CandidatsTab = 'cvtheque' | 'inbox'

export const CANDIDAT_TAB_ITEMS = [
  { id: 'cvtheque' as const, label: 'CVthèque' },
  { id: 'inbox' as const, label: 'Candidatures reçues' },
]

export const ENTREES_APP_HREF = '/interim/entrees-app'

export function parseCandidatsTab(param: string | null | undefined): CandidatsTab {
  if (param === 'inbox') return 'inbox'
  return 'cvtheque'
}

export function legacyProfilsAppRedirect(target: string): string | null {
  if (target === 'app-profiles') return ENTREES_APP_HREF
  if (target.startsWith('/candidats/profils-app')) return ENTREES_APP_HREF
  return null
}

export function candidatsPageHref(tab: CandidatsTab = 'cvtheque'): string {
  if (tab === 'inbox') return '/candidats?tab=inbox'
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
