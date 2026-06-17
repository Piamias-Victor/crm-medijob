# CONTEXT.md — crm-medijob

> Domain glossary and bounded-context map for the CRM MediJob project.
> Kept up to date by `/grill-with-docs`. Don't edit manually — run that skill instead.

---

## Glossaire

### Candidat
Professionnel de la pharmacie (pharmacien, préparateur, étudiant en pharmacie, rayonniste, ou autre) dont le profil est géré par l'agence en vue d'un placement en mission. Un candidat est rattaché à un recruteur référent (responsabilité, pas restriction de visibilité). Il peut exister sans CV et sans mission active, et reste dans le système après placement.

### Pharmacie
Structure cliente de l'agence (officine indépendante, groupe ou clinique) qui publie des besoins de recrutement. Elle peut exister sans contact rattaché. Son statut (`PROSPECT` / `ACTIF` / `INACTIF`) est géré manuellement par le recruteur — il n'est pas calculé automatiquement à partir des missions. Identifiée de façon unique par son SIRET.

### Disponibilité candidat (CandidateStatus)
Champ manquant dans la spec — à ajouter sur `Candidate`. Enum : `DISPONIBLE` | `EN_MISSION` | `SOUS_PREAVIS` | `INACTIF`. Géré manuellement par le recruteur. `availableFrom: DateTime?` reste pour indiquer une date future de disponibilité.

### Responsable mission
Champ manquant dans la spec — à ajouter sur `Mission` : `referentId: String` pointant vers un `User`. Même logique que le référent candidat : responsabilité sans restriction de visibilité.

### Placement
Action par laquelle un candidat est confirmé sur une mission. Déclenche manuellement trois effets : (1) le candidat passe à l'étape "Placé" du pipeline, (2) son `CandidateStatus` passe à `EN_MISSION`, (3) la mission passe au statut `EN_COURS`. Ces transitions sont effectuées par le recruteur, pas automatiquement.

### Emails transactionnels
Envoyés via Resend (obligatoire, pas optionnel en V1). Deux cas d'usage : (1) envoi du dossier anonymisé à une pharmacie, (2) réinitialisation de mot de passe pour un utilisateur.

### Type de contrat
Enum sur `Mission` : `CDI`, `CDD`, `REMPLACEMENT`. La valeur `VACATION` de la spec est supprimée — fusionnée dans `REMPLACEMENT` (pas de différence fonctionnelle terrain).

### Résumé IA (cvSummary)
Synthèse markdown du profil candidat générée par Gemini Flash-Lite à partir des notes, de l'expérience brute, du métier et des logiciels. Stockée dans `candidate.cvSummary`. Éditable manuellement par le recruteur après génération. Prérequis obligatoire à la génération du dossier anonymisé.

### Référent
Recruteur responsable d'un candidat (`referentId` obligatoire). Tout recruteur peut réassigner le référent d'un candidat. Si le compte du référent est soft-deleté, ses candidats deviennent orphelins — un admin doit les réassigner manuellement.

### Mobilité
Décrite par un rayon en km (`mobilityRadiusKm`) et des notes libres (`mobilityNotes`). Utilisée pour le matching sur une mission : depuis la fiche mission, l'app peut suggérer les candidats dont le rayon de mobilité couvre la pharmacie concernée.

### Recherche
Filtre local par liste — pas de barre globale. Chaque section expose sa propre barre de recherche : candidats (nom, ville, métier), pharmacies (nom, ville, SIRET), contacts (nom, pharmacie associée), missions (titre, pharmacie). Le filtrage s'effectue en temps réel côté client.

### Logiciel (Software)
Outil métier pharmaceutique (ex. : Winpharma, Pharmaland) maîtrisé par un candidat. La liste est administrée par un admin — pas de saisie libre possible. Lors de l'extraction CV, l'IA suggère les logiciels détectés ; le recruteur confirme lors de la relecture obligatoire.

### Dossier anonymisé
Profil candidat expurgé de toute PII (Personally Identifiable Information), généré par Gemini Flash-Lite à partir du résumé IA, du métier, des logiciels, de la mobilité et de la disponibilité. Stocké en markdown dans `candidate.anonymizedProfile`. La génération est manuelle (bouton) ; si le profil change après génération, le recruteur doit re-générer manuellement. Transmis à la pharmacie par envoi email direct depuis l'app (Resend — obligatoire, pas optionnel).

### Enrichissement SIRET
Lookup sur `recherche-entreprises.api.gouv.fr` (gratuit, sans clé) disponible à tout moment depuis la fiche pharmacie — pas uniquement à la création. Pré-remplit nom, adresse, ville, CP, forme juridique, et calcule le numéro de TVA (`(12 + 3 × (SIREN % 97)) % 97`). Si des données existent déjà, les nouvelles valeurs sont proposées champ par champ — le recruteur confirme avant écrasement.

### Extraction CV
Pipeline IA déclenchée par upload d'un PDF. Le résultat brut de Gemini Flash-Lite est validé par un schéma Zod strict, puis présenté dans un écran de relecture obligatoire — le recruteur valide chaque champ avant que le candidat soit créé en base. Si l'email extrait correspond à un candidat existant, le recruteur est averti du doublon potentiel et choisit la conduite à tenir.

### Soft delete
Suppression logique via `deletedAt: DateTime?`. Une entité soft-deletée disparaît de toutes les listes et vues sans être physiquement supprimée de la base. Applicable sur : `User`, `Candidate`, `Pharmacy`, `Contact`, `Mission`. La suppression est irréversible depuis l'interface. Cascade : supprimer une `Pharmacy` soft-delete automatiquement ses `Mission`s associées.

### Événement (CandidateEvent)
Entrée horodatée dans l'historique d'un candidat, typée parmi : `APPEL`, `EMAIL`, `ENTRETIEN`, `MISSION`, `NOTE`, `AUTRE`. Créé et éditable par un recruteur (l'auteur peut corriger une erreur). Le type `MISSION` est créé manuellement — il n'est pas généré automatiquement lors du positionnement d'un candidat sur une mission.

### Recruteur
Utilisateur interne de l'agence. Gère candidats, pharmacies, contacts et missions. Voit toutes les données sans cloisonnement — le `referentId` sur un candidat indique le responsable mais ne restreint pas les autres recruteurs. Un admin peut aussi être référent d'un candidat.

### Admin
Recruteur avec droits supplémentaires : configuration du pipeline, gestion des logiciels, gestion des utilisateurs. Plusieurs admins peuvent coexister dans le système.

### Pipeline
Séquence ordonnée d'étapes (`PipelineStage`) configurée par un admin, partagée entre toutes les missions. Un candidat positionné sur une mission occupe exactement une étape du pipeline via `MissionCandidate`. Un candidat peut être sur plusieurs missions simultanément, à des étapes différentes.

Il n'existe pas de kanban global des candidats. Le pipeline est visible à deux endroits :
- `/missions/[id]` onglet Pipeline — kanban des candidats positionnés sur cette mission (colonnes = étapes)
- `/candidats/[id]` onglet Missions — kanban des missions du candidat (colonnes = étapes du pipeline, cartes = missions)

### Mission
Besoin de recrutement exprimé par une pharmacie, caractérisé par un type de contrat (CDI, CDD, remplacement) et un statut géré manuellement. `OUVERTE` = en cours de recrutement (défaut). `EN_COURS` = le candidat est activement en poste. `TERMINEE` = la mission est réellement terminée (clôture manuelle). `ANNULEE` = la mission n'a pas abouti.

Une mission porte la tarification complète : taux horaire candidat (`candidateRate`), taux horaire client (`clientRate`), heures prévues (`plannedHours`). La marge agence est calculée automatiquement (`clientRate − candidateRate`), pas stockée en base. Elle a un recruteur responsable (`referentId`).

### Contact
Interlocuteur humain pouvant être rattaché à une ou plusieurs pharmacies (ex. : gérant de groupe). La relation Contact ↔ Pharmacie est portée par une table pivot `ContactPharmacy`. Un contact peut être marqué contact principal (`isPrimary`) pour une pharmacie donnée. Il peut également être désigné comme interlocuteur d'une mission spécifique.
