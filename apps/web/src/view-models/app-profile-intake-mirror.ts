import type { ActivityType, AppCallOutcome, AppIntakeStatus } from '@prisma/client'
import {
  APP_CALL_OUTCOME_LABELS,
  APP_INTAKE_STATUS_LABELS,
} from '@/view-models/app-profile-intake.labels'

export type IntakeMirrorSnapshot = {
  intakeStatus: AppIntakeStatus
  callOutcome: AppCallOutcome | null
  plannedRdvAt: Date | null
  notes: string | null
  referentId: string | null
  relanceAt: Date | null
}

export type IntakeMirrorActivity = { type: ActivityType; content: string }

function sameDate(a: Date | null, b: Date | null) {
  if (a == null && b == null) return true
  if (a == null || b == null) return false
  return a.getTime() === b.getTime()
}

export function buildIntakeMirrorActivities(
  previous: IntakeMirrorSnapshot,
  next: IntakeMirrorSnapshot,
): IntakeMirrorActivity[] {
  const logs: IntakeMirrorActivity[] = []
  if (previous.intakeStatus !== next.intakeStatus) {
    logs.push({
      type: 'NOTE',
      content: `Entrées app — Statut : ${APP_INTAKE_STATUS_LABELS[next.intakeStatus]}`,
    })
  }
  if (previous.callOutcome !== next.callOutcome) {
    logs.push({
      type: 'APPEL',
      content: `Entrées app — Appel : ${
        next.callOutcome ? APP_CALL_OUTCOME_LABELS[next.callOutcome] : '—'
      }`,
    })
  }
  if (!sameDate(previous.plannedRdvAt, next.plannedRdvAt)) {
    logs.push({
      type: 'ENTRETIEN',
      content: `Entrées app — RDV : ${
        next.plannedRdvAt
          ? next.plannedRdvAt.toLocaleDateString('fr-FR')
          : '—'
      }`,
    })
  }
  if ((previous.notes ?? '') !== (next.notes ?? '')) {
    logs.push({
      type: 'NOTE',
      content: `Entrées app — Notes : ${next.notes?.trim() || '—'}`,
    })
  }
  if (!sameDate(previous.relanceAt, next.relanceAt)) {
    logs.push({
      type: 'NOTE',
      content: `Entrées app — Relance : ${
        next.relanceAt ? next.relanceAt.toLocaleDateString('fr-FR') : '—'
      }`,
    })
  }
  return logs
}
