export type ColorToken = { name: string; className: string; description: string }

export const colorTokens: ColorToken[] = [
  { name: 'primary', className: 'bg-primary', description: 'Teal — actions principales' },
  { name: 'primary-hover', className: 'bg-primary-hover', description: 'Teal survol' },
  { name: 'primary-muted', className: 'bg-primary-muted', description: 'Teal fond doux' },
  { name: 'accent', className: 'bg-accent', description: 'Mint — accent Medijob' },
  { name: 'accent-hover', className: 'bg-accent-hover', description: 'Mint survol / texte' },
  { name: 'accent-muted', className: 'bg-accent-muted', description: 'Mint fond doux' },
  { name: 'sky', className: 'bg-sky', description: 'Sky — highlight discret' },
  { name: 'sky-muted', className: 'bg-sky-muted', description: 'Sky fond doux' },
  { name: 'rose', className: 'bg-rose', description: 'Rose — accent secondaire' },
  { name: 'rose-muted', className: 'bg-rose-muted', description: 'Rose fond doux' },
  { name: 'surface', className: 'bg-surface', description: 'Fond application' },
  { name: 'border', className: 'bg-border', description: 'Bordures' },
  { name: 'fg', className: 'bg-fg', description: 'Texte principal' },
  { name: 'fg-muted', className: 'bg-fg-muted', description: 'Texte secondaire' },
  { name: 'success', className: 'bg-success', description: 'Succès (mint profond)' },
  { name: 'warning', className: 'bg-warning', description: 'Attention (sky profond)' },
  { name: 'error', className: 'bg-error', description: 'Erreur (rose profond)' },
]
