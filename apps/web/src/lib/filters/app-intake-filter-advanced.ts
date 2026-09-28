export function appIntakeAdvancedFilters() {
  return [
    { id: 'city' as const, label: 'Ville', type: 'text' as const, placeholder: 'Ville…' },
    {
      id: 'postalCode' as const,
      label: 'Code postal',
      type: 'text' as const,
      placeholder: 'CP…',
    },
    { id: 'metier' as const, label: 'Métier', type: 'text' as const, placeholder: 'Métier…' },
    {
      id: 'smsSent' as const,
      label: 'SMS RDV',
      type: 'select' as const,
      placeholder: 'Tous',
      options: [
        { value: 'sent', label: 'Envoyé' },
        { value: 'missing', label: 'Non envoyé' },
      ],
    },
    { id: 'overdue' as const, label: 'Relance en retard', type: 'boolean' as const },
    { id: 'hasNotes' as const, label: 'Avec notes', type: 'boolean' as const },
    { id: 'enrolledAt' as const, label: 'Inscrit le', type: 'date-range' as const },
    { id: 'relanceAt' as const, label: 'Relance', type: 'date-range' as const },
    { id: 'plannedRdvAt' as const, label: 'RDV', type: 'date-range' as const },
  ]
}
