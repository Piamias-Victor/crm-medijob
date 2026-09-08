import type { BadakanEnterprise } from '@/server/badakan/map-enterprise'

export function pickEnterprisePerSiret(rows: BadakanEnterprise[]): BadakanEnterprise[] {
  const bySiret = new Map<string, BadakanEnterprise>()
  const noSiret: BadakanEnterprise[] = []
  for (const row of rows) {
    if (!row.siret) {
      noSiret.push(row)
      continue
    }
    const prev = bySiret.get(row.siret)
    if (!prev || row.badakanId < prev.badakanId) bySiret.set(row.siret, row)
  }
  return [...bySiret.values(), ...noSiret]
}
