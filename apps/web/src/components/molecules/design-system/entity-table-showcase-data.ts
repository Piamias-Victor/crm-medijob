import type { DemoListRow } from '@/lib/filters/demo-list-types'

const names = ['Alice Martin', 'Bruno Dupont', 'Camille Durand', 'Émile Rousseau', 'Zoé Lambert']
const metiers = ['pharmacien', 'preparateur'] as const
const contratOptions = ['cdi', 'cdd', 'interim'] as const

export { demoFilterConfig, type DemoFilterConfig } from '@/lib/filters/demo-list-types'

export function buildDemoListRows(): DemoListRow[] {
  return Array.from({ length: 50 }, (_, index) => ({
    id: String(index + 1),
    name: `${names[index % names.length]} ${index + 1}`,
    city: index % 2 === 0 ? 'Lyon' : 'Paris',
    departement: index % 2 === 0 ? '69' : '75',
    metier: metiers[index % metiers.length],
    contrats: contratOptions.filter((_, optionIndex) => (index + optionIndex) % 2 === 0),
    createdAt: new Date(2024, index % 12, (index % 27) + 1),
    ca: 1000 + index * 250,
    incomplete: index % 5 === 0,
  }))
}
