import { EMPTY_FACTURATION_OVERVIEW } from '@/view-models/facturation-overview'
import type { FacturationDeps } from '@/server/routers/facturation'

const emptyRefs = { pharmacies: [], recruiters: [], candidates: [], missions: [] }

const unusedCreateLine: FacturationDeps['createLine'] = async () => {
  throw new Error('createLine unused')
}

const unusedGenerateDevis: FacturationDeps['generateDevisFromLine'] = async () => {
  throw new Error('generateDevisFromLine unused')
}

const unusedSendDevis: FacturationDeps['sendDevisFromLine'] = async () => {
  throw new Error('sendDevisFromLine unused')
}

const unusedPreviewDevis: FacturationDeps['previewDevis'] = async () => {
  throw new Error('previewDevis unused')
}

const unusedSaveDevis: FacturationDeps['saveDevis'] = async () => {
  throw new Error('saveDevis unused')
}

const unusedSendFormDevis: FacturationDeps['sendDevis'] = async () => {
  throw new Error('sendDevis unused')
}

const unusedCancelLine: FacturationDeps['cancelLine'] = async () => {
  throw new Error('cancelLine unused')
}

const unusedRestoreLine: FacturationDeps['restoreLine'] = async () => {
  throw new Error('restoreLine unused')
}

const unusedSetInvoiced: FacturationDeps['setInvoiced'] = async () => {
  throw new Error('setInvoiced unused')
}

const unusedSetPaid: FacturationDeps['setPaid'] = async () => {
  throw new Error('setPaid unused')
}

export function facturationTestDeps(
  listSuivi: FacturationDeps['listSuivi'] = async () => [],
): FacturationDeps {
  return {
    listSuivi,
    overview: async () => EMPTY_FACTURATION_OVERVIEW,
    referentials: async () => emptyRefs,
    createLine: unusedCreateLine,
    generateDevisFromLine: unusedGenerateDevis,
    sendDevisFromLine: unusedSendDevis,
    previewDevis: unusedPreviewDevis,
    saveDevis: unusedSaveDevis,
    sendDevis: unusedSendFormDevis,
    cancelLine: unusedCancelLine,
    restoreLine: unusedRestoreLine,
    setInvoiced: unusedSetInvoiced,
    setPaid: unusedSetPaid,
  }
}
