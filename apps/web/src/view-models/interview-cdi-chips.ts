type Chip = { label: string; text: string }

const chip = (label: string): Chip => ({ label, text: label })

const VISION_3Y = ['Pas de vision', 'Adjoint stable', 'Management', 'Titulaire / associé'].map(chip)

const WHY_CDI = [
  'Stabilité',
  'Évolution',
  'Équipe',
  'Conditions',
  'Installation',
  'Lassé de l’intérim',
].map(chip)

const MEDIJOB = ['Rien', 'Nom / site', 'Intérim pharma', 'Approche claire'].map(chip)

const OFFICINE = [
  'Petite / quartier',
  'Grosse / groupe',
  'Équipe soudée',
  'Volume',
  'Horaires',
  'Formation / projet',
].map(chip)

const SALAIRE = ['Coeff CCN', 'Fixe', 'Variable', 'Avantages', 'Fourchette dite'].map(chip)

export function cdiInterviewChips(prompt: string): Chip[] | null {
  const text = prompt.toLowerCase()
  if (text.includes('dans 3 ans')) return VISION_3Y
  if (text.includes('cdi / cdd plutôt')) return WHY_CDI
  if (text.includes('savez-vous de medijob')) return MEDIJOB
  if (text.includes('officine / environnement')) return OFFICINE
  if (text.includes('attentes salariales')) return SALAIRE
  return null
}

export function cdiChipsAreExclusive(prompt: string): boolean {
  const text = prompt.toLowerCase()
  return text.includes('dans 3 ans') || text.includes('savez-vous de medijob')
}
