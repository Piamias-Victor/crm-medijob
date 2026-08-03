import { ExternalLink } from 'lucide-react'
import { getRgpdRegisterUrl } from '@/server/gdpr/register-url'

export default function AdminRgpdPage() {
  const url = getRgpdRegisterUrl()

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-surface/80 p-6">
      <h2 className="text-lg font-semibold text-fg">Registre des traitements</h2>
      <p className="text-sm text-fg-muted">
        Le registre RGPD est tenu hors CRM (Notion / PDF). Lien configurable via{' '}
        <code className="text-xs">RGPD_REGISTER_URL</code>.
      </p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent-hover underline-offset-2 hover:underline"
        >
          Ouvrir le registre
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      ) : (
        <p className="text-sm text-fg-muted">Aucune URL configurée pour le moment.</p>
      )}
    </section>
  )
}
