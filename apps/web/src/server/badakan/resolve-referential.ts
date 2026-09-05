export type ReferentialEntry = { id: string; name: string }

// Badakan labels carry a seniority suffix ("Préparateur Expert") and free-text
// instructions ("logiciel : Léo + PDA"), so both sides are matched on word tokens.
const GENERIC_JOB_TITLES = ['autre', 'test']

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

export function resolveJobTitleId(
  activityLabel: string | null | undefined,
  jobTitles: ReferentialEntry[],
): string | null {
  if (!activityLabel) return null
  const haystack = new Set(tokens(activityLabel))
  let best: { id: string; score: number } | null = null
  for (const jobTitle of jobTitles) {
    if (GENERIC_JOB_TITLES.includes(normalize(jobTitle.name))) continue
    const needles = tokens(jobTitle.name)
    if (!needles.length || !needles.every((token) => haystack.has(token))) continue
    if (!best || needles.length > best.score) best = { id: jobTitle.id, score: needles.length }
  }
  return best?.id ?? null
}

export function resolveSoftwareId(
  instruction: string | null | undefined,
  softwares: ReferentialEntry[],
): string | null {
  if (!instruction) return null
  const haystack = tokens(instruction)
  let best: { id: string; score: number } | null = null
  for (const software of softwares) {
    const needles = tokens(software.name)
    if (!needles.length || !needles.every((token) => haystack.includes(token))) continue
    if (!best || needles.length > best.score) best = { id: software.id, score: needles.length }
  }
  return best?.id ?? null
}
