export type ColorToken = { name: string; className: string; description: string }

export const colorTokens: ColorToken[] = [
  { name: 'primary', className: 'bg-primary', description: 'Navy — actions principales' },
  { name: 'primary-hover', className: 'bg-primary-hover', description: 'Navy survol' },
  { name: 'primary-muted', className: 'bg-primary-muted', description: 'Navy fond doux' },
  { name: 'accent', className: 'bg-accent', description: 'Teal — accent Medijob' },
  { name: 'accent-hover', className: 'bg-accent-hover', description: 'Teal survol' },
  { name: 'accent-muted', className: 'bg-accent-muted', description: 'Teal fond doux' },
  { name: 'surface', className: 'bg-surface', description: 'Fond application' },
  { name: 'border', className: 'bg-border', description: 'Bordures' },
  { name: 'fg', className: 'bg-fg', description: 'Texte principal' },
  { name: 'fg-muted', className: 'bg-fg-muted', description: 'Texte secondaire' },
  { name: 'success', className: 'bg-success', description: 'Succès' },
  { name: 'warning', className: 'bg-warning', description: 'Avertissement' },
  { name: 'error', className: 'bg-error', description: 'Erreur / destructif' },
]
