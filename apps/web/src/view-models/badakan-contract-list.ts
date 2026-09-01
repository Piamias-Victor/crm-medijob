import { badakanContractStatusLabel } from './badakan-contract-status'

export type BadakanContractListSource = {
  id: string
  recipientName: string
  pharmacyName: string
  status: string
  pdfUrl: string | null
  dpaeUrl: string | null
}

export type BadakanContractListItem = {
  id: string
  recipientName: string
  pharmacyName: string
  status: string
  statusLabel: string
  pdfHref: string | null
  dpaeHref: string | null
}

export function toBadakanContractListItem(
  row: BadakanContractListSource,
): BadakanContractListItem {
  return {
    id: row.id,
    recipientName: row.recipientName,
    pharmacyName: row.pharmacyName,
    status: row.status,
    statusLabel: badakanContractStatusLabel(row.status),
    pdfHref: row.pdfUrl,
    dpaeHref: row.dpaeUrl,
  }
}

export function toBadakanContractListItems(rows: BadakanContractListSource[]) {
  return rows.map(toBadakanContractListItem)
}
