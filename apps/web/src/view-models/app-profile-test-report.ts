import type { TestOneReport } from '@/server/app-profile/test-one'

const FAILURES: Record<Extract<TestOneReport, { ok: false }>['reason'], string> = {
  test_phone_missing: 'Renseigne AVAILABILITY_LINK_TEST_PHONE avant de lancer un test.',
  recipient_missing: 'Profil introuvable côté Badakan.',
  candidate_missing: 'Aucune fiche candidat créée par la synchro.',
}

export function testProcessMessage(report: TestOneReport): string {
  if (!report.ok) return FAILURES[report.reason]
  const created = report.sync.created > 0 ? 'fiche créée' : 'fiche déjà existante'
  const sms = report.sms === 'sent' ? `SMS envoyé au ${report.sentTo}` : 'SMS non envoyé'
  return `${report.name} : ${created}, ${sms}.`
}
