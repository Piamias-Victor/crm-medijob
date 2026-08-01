'use client'

type Props = {
  error: string | null
  onFile: (file: File) => void
}

export function PharmacyCsvUploadStep({ error, onFile }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-fg-muted">
        Importez un fichier CSV (séparateur « ; », UTF-8). Max 5 Mo / 2000 lignes.
      </p>
      <label className="flex cursor-pointer flex-col items-start gap-2">
        <span className="text-sm font-medium text-fg">Fichier CSV</span>
        <input
          type="file"
          accept=".csv,text/csv"
          className="block w-full text-sm text-fg"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onFile(file)
          }}
        />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
