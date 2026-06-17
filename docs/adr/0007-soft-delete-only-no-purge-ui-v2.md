# Soft delete seul en V2, purge physique hors produit

Le droit à l'oubli et la purge cascade (DB + Vercel Blob) sont sensibles juridiquement et techniquement. La relecture juridique n'est pas encore faite.

Décision : V2 n'expose que le soft delete (`deletedAt`) dans l'UI. La purge physique est réservée à un script CLI hors produit, déployé seulement si le juriste l'exige après relecture. Les enregistrements soft-deleted sont masqués pour tous — pas de corbeille ni restauration en UI V2 ; une restauration éventuelle passe par script CLI.
