import type { AppCallOutcome, AppProfileStatus } from '@prisma/client'
import type { AppIntakeStatus } from './app-profile-intake.enums'
import {
  APP_CALL_OUTCOME_LABELS,
  APP_INTAKE_STATUS_LABELS,
} from './app-profile-intake.labels'
import { DEFAULT_APP_INTAKE_STATUS_ID } from './app-profile-intake.enums'
import type { SyncroImportMapped, SyncroSheetRow } from './syncro-import.types'

export type { SyncroImportMapped, SyncroSheetRow }

const INTAKE_BY_LABEL = Object.fromEntries(
  Object.entries(APP_INTAKE_STATUS_LABELS).map(([k, v]) => [v, k]),
) as Record<string, AppIntakeStatus>

const OUTCOME_BY_LABEL = Object.fromEntries(
  Object.entries(APP_CALL_OUTCOME_LABELS).map(([k, v]) => [v, k]),
) as Record<string, AppCallOutcome>

function cell(v: string | null | undefined): string | null {
  if (v == null) return null
  const t = String(v).trim()
  return t === '' ? null : t
}

function parseDate(v: string | Date | null | undefined): Date | null {
  if (v == null || v === '') return null
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v
  const d = new Date(String(v))
  return Number.isNaN(d.getTime()) ? null : d
}

function postalCode(cp: string | number | null | undefined): string | null {
  if (cp == null || cp === '') return null
  return String(cp).replace(/\.0$/, '')
}

function profileStatus(statut: string | null, valide: string | null): AppProfileStatus {
  if (statut === 'Suspendu') return 'IGNORE'
  if (statut === 'Validé' || valide === 'OUI') return 'APP_VALIDATED'
  return 'EN_ATTENTE'
}

function intakeStatus(statut: string | null): string {
  if (!statut) return DEFAULT_APP_INTAKE_STATUS_ID
  return INTAKE_BY_LABEL[statut] ?? DEFAULT_APP_INTAKE_STATUS_ID
}

export function mapSyncroRow(row: SyncroSheetRow): SyncroImportMapped {
  const statut = cell(row.statut)
  const resultat = cell(row.resultat)
  return {
    badakanId: row.id.trim(),
    firstName: row.prenom.trim(),
    lastName: row.nom.trim(),
    phone: cell(row.telephone),
    email: cell(row.email),
    address: cell(row.adresse),
    city: cell(row.ville),
    postalCode: postalCode(row.cp),
    activityLabel: cell(row.metier) ?? cell(row.profil),
    profileStatus: profileStatus(statut, cell(row.valide)),
    intakeStatus: intakeStatus(statut),
    callOutcome: resultat ? (OUTCOME_BY_LABEL[resultat] ?? null) : null,
    notes: cell(row.notes),
    plannedRdvAt: parseDate(row.rdvLe),
    relanceAt: parseDate(row.relance),
    lastCalledAt: parseDate(row.dernierAppel),
    referentName: cell(row.attribueA),
    lastCalledByName: cell(row.appelPar),
  }
}
