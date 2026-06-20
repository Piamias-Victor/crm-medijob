# Documents : suppression physique + blob

ADR 0007 impose le soft delete (`deletedAt`) pour les entités métier auditables (candidats, pharmacies, missions, etc.).

Les documents sont des artefacts fichiers (PDF, contrats) stockés sur Vercel Blob. Leur valeur opérationnelle est le fichier lui-même ; conserver une ligne DB « fantôme » sans blob n'apporte pas de traçabilité utile et gonfle le stockage.

Décision : la suppression document en V2 = hard delete de la ligne `Document` **et** du blob associé. Pas de `deletedAt` sur `Document` en V2. La purge est immédiate côté UI (confirm dialog). Restauration éventuelle hors produit via sauvegardes blob si besoin juridique.
