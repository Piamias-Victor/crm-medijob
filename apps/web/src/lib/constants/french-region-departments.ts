import type { FilterOption } from '@/lib/filters/filter-types'

/** Métropole hors Corse/DOM — aligné sur `FRENCH_DEPARTMENT_OPTIONS` (pas de 2A/2B/97x). */
const RAW =
  'ARA:Auvergne-Rhône-Alpes:01,03,07,15,26,38,42,43,63,69,73,74|' +
  'BFC:Bourgogne-Franche-Comté:21,25,39,58,70,71,89,90|' +
  'BRE:Bretagne:22,29,35,56|' +
  'CVL:Centre-Val de Loire:18,28,36,37,41,45|' +
  'GES:Grand Est:08,10,51,52,54,55,57,67,68,88|' +
  'HDF:Hauts-de-France:02,59,60,62,80|' +
  'IDF:Île-de-France:75,77,78,91,92,93,94,95|' +
  'NOR:Normandie:14,27,50,61,76|' +
  'NAQ:Nouvelle-Aquitaine:16,17,19,23,24,33,40,47,64,79,86,87|' +
  'OCC:Occitanie:09,11,12,30,31,32,34,46,48,65,66,81,82|' +
  'PDL:Pays de la Loire:44,49,53,72,85|' +
  'PAC:Provence-Alpes-Côte d\'Azur:04,05,06,13,83,84'

const REGION_DEPTS = new Map(
  RAW.split('|').map((entry) => {
    const [id, , depts] = entry.split(':')
    return [id!, depts!.split(',')] as const
  }),
)

export const FRENCH_REGION_OPTIONS: FilterOption[] = RAW.split('|').map((entry) => {
  const [value, label] = entry.split(':')
  return { value: value!, label: label! }
})

export function departmentsForRegions(regionIds: readonly string[]): string[] {
  const depts = new Set<string>()
  for (const id of regionIds) {
    for (const dept of REGION_DEPTS.get(id) ?? []) depts.add(dept)
  }
  return [...depts]
}
