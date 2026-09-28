export const appIntakeExitActions = {
  ignore: {
    label: '✗',
    title: 'Ignorer — statut Inactif, sort des Entrées',
    variant: 'danger' as const,
  },
  qualify: {
    label: '✓',
    title: 'Qualifié — statut Qualifié, sort des Entrées',
    variant: 'accent' as const,
  },
} as const
