const JSON_SHAPE = `{
  "jobTitle"?: string,
  "softwares"?: string[],
  "availableFrom"?: string (ISO datetime),
  "mobilityRadiusKm"?: number,
  "mobilityNotes"?: string
}`

export type PromptRefNames = { softwares: string[]; jobTitles: string[] }

export function buildCommentIntakePrompt(commentsText: string, refs: PromptRefNames) {
  return [
    'Tu es un assistant de recrutement médical pour le CRM MediJob.',
    'Analyse les commentaires Badakan (résumés d’appel) et extrais les faits CRM.',
    `Réponds STRICTEMENT en JSON valide : ${JSON_SHAPE}.`,
    'Règles :',
    '- jobTitle = métier EXACT écrit dans le texte (Préparatrice, Préparateur, Pharmacien…).',
    '- jobTitle : ne pas généraliser ni surclasser (Préparatrice ≠ Pharmacien). Omettre si absent.',
    `- Métiers connus : ${refs.jobTitles.join(', ') || 'aucun'}.`,
    '- softwares = noms de LGO / logiciels officinaux cités (LGPI, Winpharma, Crystal, Pharmagest, etc.).',
    `- Catalogue logiciels : ${refs.softwares.join(', ') || 'aucun'}.`,
    '- availableFrom = date de début de disponibilité annoncée, jamais une date de poste passé,',
    '  de diplôme ou de dernier contrat. Dans le doute, omettre.',
    '- mobilityRadiusKm = rayon en km si cité, sinon omettre.',
    '- N’invente aucun métier, logiciel ni date absents du texte.',
    '- N’ajoute aucun texte hors JSON. Omets une clé plutôt que de la remplir avec null.',
    '',
    'Commentaires :',
    commentsText,
  ].join('\n')
}
