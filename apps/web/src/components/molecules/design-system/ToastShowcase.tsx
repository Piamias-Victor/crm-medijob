import { CheckCircle2, AlertCircle, XCircle, type LucideIcon } from 'lucide-react'

type Toast = { icon: LucideIcon; tone: string; title: string }

const toasts: Toast[] = [
  { icon: CheckCircle2, tone: 'text-success', title: 'Candidat enregistré' },
  { icon: AlertCircle, tone: 'text-warning', title: 'SIRET à vérifier' },
  { icon: XCircle, tone: 'text-error', title: "Échec de l'envoi email" },
]

export function ToastShowcase() {
  return (
    <div className="space-y-3">
      {toasts.map((toast) => {
        const Icon = toast.icon
        return (
          <div
            key={toast.title}
            className="flex items-center gap-3 rounded-md border border-border bg-white px-4 py-3 shadow-sm"
          >
            <Icon className={`size-5 ${toast.tone}`} />
            <span className="text-sm text-fg">{toast.title}</span>
          </div>
        )
      })}
    </div>
  )
}
