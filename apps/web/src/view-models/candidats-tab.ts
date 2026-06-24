export type CandidatsTab = 'cvtheque' | 'inbox'

export function parseCandidatsTab(param: string | null | undefined): CandidatsTab {
  return param === 'inbox' ? 'inbox' : 'cvtheque'
}

export function candidatsPageHref(tab: CandidatsTab = 'cvtheque'): string {
  return tab === 'inbox' ? '/candidats?tab=inbox' : '/candidats'
}

export function candidatsNavHref(inboxPending: number): string {
  return inboxPending > 0 ? candidatsPageHref('inbox') : candidatsPageHref('cvtheque')
}
