import { Input } from '@/components/atoms/Input'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      {children}
    </label>
  )
}

export function InputsShowcase() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Default">
        <Input placeholder="Nom du candidat" />
      </Field>
      <Field label="Focus">
        <Input
          placeholder="Saisie active"
          className="border-accent ring-2 ring-accent-muted"
        />
      </Field>
      <Field label="Error">
        <Input
          aria-invalid
          defaultValue="email-invalide"
          className="border-error ring-2 ring-error/20"
        />
        <span className="text-xs text-error">Adresse email invalide</span>
      </Field>
      <Field label="Disabled">
        <Input disabled defaultValue="Champ verrouillé" />
      </Field>
    </div>
  )
}
