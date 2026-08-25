import {
  FINANCE_LINE_CREATED,
  FINANCE_LINE_DEVIS_GENERATED,
  FINANCE_LINE_CANCELLED,
  FINANCE_LINE_RESTORED,
} from '@/view-models/finance-line-copy'
import { DEVIS_SEND_SUCCESS } from '@/view-models/devis-copy'

export const financeLineActionToast = {
  save: FINANCE_LINE_CREATED,
  generate: FINANCE_LINE_DEVIS_GENERATED,
  send: DEVIS_SEND_SUCCESS,
  cancel: FINANCE_LINE_CANCELLED,
  restore: FINANCE_LINE_RESTORED,
} as const
