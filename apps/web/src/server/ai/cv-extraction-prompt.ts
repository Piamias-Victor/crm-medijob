const CV_JSON_SHAPE = `{
  "firstName": string,
  "lastName": string,
  "email"?: string,
  "phone"?: string,
  "address"?: string,
  "city"?: string,
  "postalCode"?: string (5 chiffres France),
  "jobTitle"?: string,
  "softwares"?: string[],
  "preferredContractTypes"?: ("CDI"|"CDD"|"INTERIM"|"VACATION")[],
  "availableFrom"?: string (ISO datetime),
  "mobilityNotes"?: string,
  "profileSummary"?: string,
  "rawText"?: string (texte brut lu dans le CV)
}`

export function buildCvExtractionPrompt(filename: string) {
  return [
    'Tu es un assistant de recrutement médical pour le CRM MediJob.',
    'Analyse le CV joint (PDF ou image) et extrais un maximum de champs.',
    `Réponds STRICTEMENT en JSON valide : ${CV_JSON_SHAPE}.`,
    'Règles :',
    '- Parcours en-tête, pied de page et encadrés contact.',
    '- Renseigne email, téléphone, adresse, ville, code postal dès qu’ils sont visibles.',
    '- Formats FR : téléphone 0X XX XX XX XX ou +33X, code postal 5 chiffres.',
    '- Métier pharmacie/officine, logiciels (Winpharma, Crystal, etc.), contrats préférés.',
    '- profileSummary = synthèse professionnelle 2-4 phrases pour le recruteur (notes internes).',
    '- profileSummary : reformule, ne copie pas mot pour mot le CV.',
    '- Ommets un champ seulement s’il est absent ; jamais "N/A", "inconnu" ou valeur inventée.',
    '- rawText = transcription textuelle la plus complète possible du CV.',
    'N’ajoute aucun texte hors JSON.',
    '',
    `Fichier : ${filename}`,
  ].join('\n')
}
