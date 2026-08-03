import {
  candidateCsvColumnMapSchema,
  type CandidateCsvColumnMap,
} from '@/view-models/candidate-csv-import.schema'

export function suggestCandidateCsvColumnMap(headers: string[]): CandidateCsvColumnMap {
  const lower = headers.map((h) => h.trim().toLowerCase())
  const find = (...aliases: string[]) => {
    const i = lower.findIndex((h) => aliases.includes(h))
    return i >= 0 ? headers[i] : undefined
  }
  return candidateCsvColumnMapSchema.parse({
    firstName: find('prenom', 'prénom', 'firstname', 'first_name', 'first name') ?? headers[0] ?? 'Prénom',
    lastName: find('nom', 'lastname', 'last_name', 'last name') ?? headers[1] ?? 'Nom',
    jobTitle: find('metier', 'métier', 'jobtitle', 'job_title', 'job title', 'poste') ?? headers[2] ?? 'Métier',
    email: find('email', 'mail'),
    phone: find('telephone', 'téléphone', 'phone', 'tel'),
    address: find('adresse', 'address'),
    city: find('ville', 'city'),
    postalCode: find('cp', 'code postal', 'postalcode', 'postal_code'),
    status: find('statut', 'status'),
    mobilityRadiusKm: find('mobilite', 'mobilité', 'mobility', 'rayon', 'km'),
    salaryExpectations: find('pretentions', 'prétentions', 'salary', 'salaire'),
    notes: find('notes', 'note', 'commentaire'),
  })
}
