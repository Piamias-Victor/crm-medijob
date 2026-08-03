import {
  pharmacyCsvColumnMapSchema,
  type PharmacyCsvColumnMap,
} from '@/view-models/pharmacy-csv-import.schema'

export function suggestPharmacyCsvColumnMap(headers: string[]): PharmacyCsvColumnMap {
  const lower = headers.map((h) => h.trim().toLowerCase())
  const find = (...aliases: string[]) => {
    const i = lower.findIndex((h) => aliases.includes(h))
    return i >= 0 ? headers[i] : undefined
  }
  return pharmacyCsvColumnMapSchema.parse({
    name: find('nom', 'name', 'pharmacie') ?? headers[0] ?? 'Nom',
    siret: find('siret'),
    address: find('adresse', 'address'),
    city: find('ville', 'city'),
    postalCode: find('cp', 'code postal', 'postalcode', 'postal_code'),
    phone: find('telephone', 'téléphone', 'phone', 'tel'),
    email: find('email', 'mail'),
    status: find('statut', 'status'),
    notes: find('notes', 'note', 'commentaire'),
  })
}
