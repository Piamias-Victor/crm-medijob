import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { FacturationLineListFiltersInput } from '@/view-models/facturation-line-filters.schema'
import type { CreateFinanceLineInput, FinanceLineDevisInput } from '@/view-models/finance-line.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { FacturationOverview } from '@/view-models/facturation-overview'
import type { FacturationMissionOption, FinanceLineRecord } from '@/view-models/finance-line'
import type { GenerateDevisFromLineResult } from '@/lib/finance/generate-devis-from-line'
import type { SendDevisFromLineResult } from '@/server/finance/send-devis-from-line'
import type { DevisView } from '@/view-models/devis'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'

type Ref = { id: string; name: string }

export type FacturationDeps = {
  listSuivi: (filters?: FacturationSuiviFilters) => Promise<FacturationSuiviRow[]>
  listLines: (filters: FacturationLineListFiltersInput) => Promise<FacturationSuiviRow[]>
  overview: (filters?: FacturationSuiviFilters) => Promise<FacturationOverview>
  referentials: () => Promise<{
    pharmacies: Ref[]
    recruiters: Ref[]
    candidates: Ref[]
    missions: FacturationMissionOption[]
  }>
  createLine: (input: CreateFinanceLineInput) => Promise<FinanceLineRecord>
  generateDevisFromLine: (id: string) => Promise<GenerateDevisFromLineResult>
  sendDevisFromLine: (id: string, authorId: string) => Promise<SendDevisFromLineResult>
  previewDevis: (input: FinanceLineDevisInput) => Promise<{ quote: DevisPdfModel }>
  saveDevis: (input: FinanceLineDevisInput) => Promise<DevisView>
  sendDevis: (input: FinanceLineDevisInput, authorId: string) => Promise<SendDevisFromLineResult>
  cancelLine: (id: string) => Promise<FinanceLineRecord>
  restoreLine: (id: string) => Promise<FinanceLineRecord>
  setInvoiced: (id: string, invoiced: boolean) => Promise<FinanceLineRecord>
  setPaid: (id: string, paid: boolean) => Promise<FinanceLineRecord>
}
