import { Button } from '@/components/atoms/Button'

type Props = {
  isCreate: boolean
  submitting: boolean
  onCancel?: () => void
}

export function CandidateCvExtractionActions({ isCreate, submitting, onCancel }: Props) {
  return (
    <div className="flex flex-wrap justify-end gap-2 border-t border-border/60 pt-4">
      {!isCreate && onCancel ? (
        <Button type="button" variant="ghost" disabled={submitting} onClick={onCancel}>
          Annuler
        </Button>
      ) : null}
      <Button type="submit" variant="accent" disabled={submitting}>
        {submitting
          ? isCreate
            ? 'Création…'
            : 'Enregistrement…'
          : isCreate
            ? 'Créer le candidat'
            : 'Confirmer la revue'}
      </Button>
    </div>
  )
}
