// Filtre partagé : exclut les enregistrements soft-deleted (ADR 0007).
export const NOT_DELETED = { deletedAt: null } as const
