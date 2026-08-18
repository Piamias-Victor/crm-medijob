import { cdiChipsAreExclusive, cdiInterviewChips } from '@/view-models/interview-cdi-chips'

type Chip = { label: string; text: string }

const chip = (label: string): Chip => ({ label, text: label })

const LIKE_INTERIM = [
  'Variété d’officines',
  'Liberté d’agenda',
  'Complément de revenus',
  'Montée en compétences',
  'Pont vers un CDI',
  'Sans management',
].map(chip)

const TYPE_MISSION = [
  '1 à 3 jours',
  'Semaine / mois',
  'Longue durée',
  'Autonome (seul)',
  'En équipe',
  'Petite officine',
  'Grosse affluence',
].map(chip)

const EXPECTATIONS = [
  'Rémunération',
  'Proximité',
  'Planning / week-ends',
  'Logiciel connu',
  'Ambiance équipe',
  'Rythme / volume',
].map(chip)

const NEW_TEAM = [
  'À l’aise tout de suite',
  'Besoin d’un briefing',
  'Observe puis agit',
  'Force de proposition',
  'Discret / s’adapte',
].map(chip)

export function pertinentInterviewChips(prompt: string): Chip[] | null {
  const text = prompt.toLowerCase()
  if (text.includes('plaît dans le remplacement')) return LIKE_INTERIM
  if (text.includes('type de remplacement recherchez')) return TYPE_MISSION
  if (text.includes('attentes et vos critères')) return EXPECTATIONS
  if (text.includes('nouvelle équipe')) return NEW_TEAM
  return cdiInterviewChips(prompt)
}

export function pertinentChipsAreExclusive(prompt: string): boolean {
  return cdiInterviewChips(prompt) !== null && cdiChipsAreExclusive(prompt)
}
