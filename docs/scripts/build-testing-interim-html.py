#!/usr/bin/env python3
"""Génère docs/testing-interim-v1.html — checklist Intérim V1 (#366–#377)."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "testing-interim-v1.html"
SHELL = ROOT / "testing-manual-v1.html"

ACCOUNTS = [
    ["⭐ Recruteur", "recruteur@medijob.fr", "recruteur-medijob-2026"],
    ["Direction", "direction@medijob.fr", "direction-medijob-2026"],
    ["Communication", "communication@medijob.fr", "communication-medijob-2026"],
    ["RH-Admin", "admin@medijob.fr", "admin-medijob-2026"],
    ["👤 Toi (testeur)", "victorpiamiaspro@gmail.com", "tester-medijob-2026"],
]

KNOWN = [
    [
        "Listes vides = normal tant que le cron n’a pas tourné",
        "Pas de bouton Rafraîchir. Sync = même cron que Profils app (GET /api/cron/app-profiles). Sans BADAKAN_EMAIL/PASSWORD → skipped, 0 lignes. Mets N/A + commente.",
    ],
    [
        "Intérim opérationnel ≠ Facturation Intérim ≠ Missions CRM",
        "/interim = Badakan (missions, contrats, vérif officines, dispos). /facturation/interim = Lignes de suivi (Direction/RH-Admin). /missions = kanban recruteur. Jamais mélanger.",
    ],
    [
        "V1 lecture seule vers Badakan",
        "Aucun staff / validate / PUT mission / POST commentaire / écriture contrat. SEARCH_APPLIED ≠ candidature site. Badakan contract ≠ Ligne de suivi.",
    ],
    [
        "SMS = un envoi auto à App-validated, pas un SMS chaque semaine",
        "Bouton « Renvoyer le lien SMS » = manuel. Restore Inactif → COMPLETED ≠ 2ᵉ SMS auto. BREVO_SMS_SENDER obligatoire sinon N/A infra.",
    ],
]


def I(text: str, hint: str = "", deferred: bool = False) -> dict:
    return {"text": text, "hint": hint, "deferred": deferred}


SECTIONS = [
    {
        "id": "env",
        "title": "0. Environnement (lire avant tout)",
        "role": "Obligatoire",
        "items": [
            I(
                "J’utilise l’URL DEV (branche dev), PAS la prod crm-medijob-web.vercel.app",
                "https://crm-medijob-web-git-dev-victor-piamias-projects.vercel.app — Intérim V1 est sur dev (#366–#377 + #390).",
            ),
            I("Je peux ouvrir /login sur cette URL (SSO Vercel OK si demandé)"),
            I("Après login Recruteur, je vois le CRM (pas seulement la page login)"),
            I(
                "Je note si Badakan est branché (données live) ou non",
                "Sans creds Badakan : listes Intérim vides + Profils app vides = N/A infra, pas un bug UI. Les parcours UI (nav, empty states, 404 token) restent testables.",
            ),
            I(
                "Je note si un cron a déjà tourné depuis le dernier deploy",
                "Vercel cron ~2 min. Listes vides au 1er load = attendu. Ne pas inventer un bouton Rafraîchir.",
            ),
        ],
    },
    {
        "id": "vocab",
        "title": "0b. Vocabulaire (ne pas confondre)",
        "role": "Lecture · avant de cliquer",
        "items": [
            I(
                "Badakan mission ≠ Mission CRM",
                "Shift app (officine, périodes, postulés SEARCH_APPLIED) dans Intérim. Pas le kanban /missions, pas de PipelineStage.",
            ),
            I(
                "SEARCH_APPLIED ≠ Application (candidature site)",
                "Postulé à un shift Badakan. L’inbox « Candidatures reçues » est le job board — autre chose.",
            ),
            I(
                "AppProfile (Profils app) ≠ Candidate CVthèque",
                "CREATED = inbox. App-validated sort de l’inbox et crée/lie un Candidate origine App. ACCEPTE recruteur (« Convertir en profil ») reste possible mais rare.",
            ),
            I(
                "App-validated ≠ Qualifié ≠ « profil validé » PDF",
                "App-validated = dossier Badakan COMPLETED. Qualifié = Entretien CRM. Le PDF « profil validé MediJob » est hors V1.",
            ),
            I(
                "Weekly availability ≠ Availability (availableFrom)",
                "Grille AM/PM datée page publique /dispo/[token]. Availability = une date de dispo CDI sur la fiche.",
            ),
            I(
                "Inactif Badakan ≠ Blacklisté",
                "SUSPENDED/BANNED → Inactif (hors filtre + SMS). Blacklisté = décision MediJob, le sync ne le touche pas.",
            ),
            I(
                "Badakan contract ≠ Ligne de suivi ≠ Devis",
                "Contrats dans /interim/contrats (PDF/DPAE). Facturation → Intérim = CA humain. Aucune ligne auto depuis un contrat.",
            ),
            I(
                "Enterprise Badakan ≠ Pharmacy tant que non validée",
                "File « Vérif officines ». Valider Pharmacy crée ou lie une fiche CRM (PROSPECT si nouvelle).",
            ),
        ],
    },
    {
        "id": "login",
        "title": "1. Connexion",
        "role": "Tous les comptes",
        "items": [
            I(
                "Login Recruteur OK — recruteur@medijob.fr / recruteur-medijob-2026",
                "Si KO Identifiants invalides → DB pas reseedée.",
            ),
            I("Login Direction OK — direction@medijob.fr / direction-medijob-2026"),
            I("Login Communication OK — communication@medijob.fr / communication-medijob-2026"),
            I("Login RH-Admin OK — admin@medijob.fr / admin-medijob-2026"),
            I(
                "Login testeur perso OK — victorpiamiaspro@gmail.com / tester-medijob-2026",
                "Rôle RH_ADMIN. Override SEED_TESTER_PASSWORD.",
            ),
        ],
    },
    {
        "id": "nav",
        "title": "2. Nav Intérim vs le reste",
        "role": "Recruteur · sidebar",
        "items": [
            I(
                "Sidebar Recruteur : entrée Intérim pointe vers /interim (pas /facturation/interim)",
                "Icône horloge. Description module : « Missions et contrats Badakan, distincts du kanban Missions et de Facturation Intérim. »",
            ),
            I("Clic Intérim → redirect /interim/missions (pas une page vide)"),
            I(
                "Sous-nav 4 pills : Missions Badakan · Contrats Badakan · Vérif officines · Disponibilités",
                "Pas de 5ᵉ pill « Rafraîchir ». Pas de lien vers /missions ni Facturation.",
            ),
            I("Recruteur : PAS d’entrée Facturation dans la sidebar"),
            I("Recruteur : entrée Missions CRM (/missions) toujours là, à part d’Intérim"),
            I("Direction : Facturation visible, sous-nav Facturation a aussi un pill « Intérim » ≠ le module opérationnel"),
            I("Communication : voit Intérim opérationnel ; PAS Facturation"),
            I("Aucune page /interim/* n’affiche un bouton Rafraîchir / Sync maintenant"),
        ],
    },
    {
        "id": "empty",
        "title": "3. Empty states (sans données / avant cron)",
        "role": "Recruteur · listes",
        "items": [
            I(
                "/interim/missions vide → « Aucune mission Badakan » + texte sync",
                "« Les shifts Badakan synchronisés apparaîtront ici. »",
            ),
            I("/interim/contrats vide → « Aucun contrat Badakan »"),
            I("/interim/officines vide → « Aucune officine à vérifier »"),
            I(
                "/interim/disponibilites sans filtre → « Filtrer les dispos »",
                "« Renseigner créneau AM/PM, métier et ville. » Pas de résultats magiques avant submit.",
            ),
            I(
                "Candidats → onglet Profils app vide → « Aucun profil app en attente »",
                "CREATED seulement. App-validated ne doit PAS rester ici.",
            ),
        ],
    },
    {
        "id": "profils-app",
        "title": "4. Profils app (CREATED / inbox)",
        "role": "Recruteur · /candidats onglet Profils app",
        "items": [
            I("Onglet « Profils app » distinct de CVthèque et de Candidatures reçues"),
            I(
                "Un CREATED Badakan apparaît ici (après cron) ; un App-validated n’y est plus",
                "Sortie = APP_VALIDATED, pas Ignorer. Si tout le monde est déjà validé côté app → inbox vide = OK.",
            ),
            I("Ouvrir un profil : fiche « Profil application », pas une fiche Candidate"),
            I(
                "Si comment Badakan : section « Commentaires Badakan » (auteur + date + texte)",
                "Endpoint comments à l’ouverture fiche, pas le cron. Vide → « Aucun commentaire Badakan. »",
            ),
            I("Pending : boutons Convertir en profil · Commencer un entretien · Ignorer"),
            I(
                "Ignorer → disparu de l’inbox ; ne doit PAS revenir au cron suivant",
                "Distinct de la sortie App-validated.",
            ),
            I(
                "Convertir en profil (rare) → Candidate CVthèque ; plus dans Profils app",
                "Chemin existant Hireflix / accept. V1 n’oblige pas ce clic pour le vivier (App-validated suffit).",
            ),
            I(
                "Invitation Hireflix ne change PAS le statut inbox et ne retire PAS le profil",
                "Completeness visible. Cancel si le profil quitte EN_ATTENTE (accept / ignore / App-validated).",
            ),
        ],
    },
    {
        "id": "app-validated",
        "title": "5. App-validated → Candidate origine App",
        "role": "Recruteur · CVthèque · #367",
        "items": [
            I(
                "Après sync COMPLETED : une personne App-validated est dans la CVthèque",
                "Create : statut Nouveau (pas Qualifié). Preuve UI : fiche + boutons « Copier le lien dispos » / « Renvoyer le lien SMS » (origin App only).",
            ),
            I("Cette personne a quitté Profils app (plus EN_ATTENTE)"),
            I("Un CREATED non validé reste dans Profils app (pas de Candidate auto)"),
            I(
                "Même email qu’un Candidate déjà Qualifié → UN seul fichier, toujours Qualifié",
                "Link email puis tél. App-validated ne rétrograde jamais.",
            ),
            I("Même téléphone (sans email) → link, pas de clone"),
            I("Historique Candidate : une trace d’intake app (ActivityLog) si créée/liée"),
            I("Candidate CRM (création manuelle) : PAS les boutons lien dispos / renvoyer SMS"),
        ],
    },
    {
        "id": "sync-champs",
        "title": "6. Sync champs Badakan vs CRM",
        "role": "Recruteur · fiche · #369",
        "items": [
            I(
                "Identité / adresse / tél / email / métier : valeur Badakan non vide gagne au sync suivant",
                "Changer côté app puis attendre le cron. Créer n’écrase pas un Qualifié status.",
            ),
            I("Salaire, logiciels, mobilité, availableFrom, notes CRM : inchangés après sync"),
            I("Champ Badakan vide / « — » → ne vide PAS le champ CRM déjà rempli"),
            I("Métier inconnu côté Badakan : ne force PAS le premier JobTitle du référentiel sur un existant"),
        ],
    },
    {
        "id": "docs-id",
        "title": "7. CV, Documents, NIR, IBAN",
        "role": "Recruteur · fiche · #370",
        "items": [
            I("Fiche origine App : CV ouvrable (cvUrl), pas un Document catégorie CV"),
            I(
                "Onglet Documents : CNI / RIB / DIPLOME si le dossier Badakan les a",
                "Skip si déjà présents (pas de re-download toutes les 2 min). Upload manuel reste possible.",
            ),
            I("Onglet Profil : NIR et IBAN en lecture seule s’ils existent (labels NIR / IBAN)"),
            I("NIR / IBAN absents de la fiche si Badakan ne les envoie pas (pas de champs vides bloquants)"),
            I("Filtres CVthèque / matching : AUCUN champ NIR ou IBAN"),
            I("Filtre Disponibilités Intérim : pas de NIR/IBAN non plus"),
        ],
    },
    {
        "id": "comments",
        "title": "8. Commentaires Badakan + notes CRM",
        "role": "Recruteur · #371",
        "items": [
            I("Profils app CREATED : commentaires Badakan visibles (ex. « Répondeur : Entretien téléphonique. »)"),
            I("Fiche Candidate origine App → onglet Historique : même bloc « Commentaires Badakan » au-dessus du timeline"),
            I("Candidate sans badakanId : « Aucun commentaire Badakan. » (0 appel API)"),
            I(
                "Ajouter une note CRM (ActivityLog) → apparaît dans l’historique, PAS dans le bloc Badakan",
                "V1 n’écrit jamais POST /comments vers Badakan.",
            ),
            I("Fiche tient si Badakan comments KO / env manquant (liste vide, pas d’écran cassé)"),
        ],
    },
    {
        "id": "inactif",
        "title": "9. SUSPENDED / BANNED → Inactif et restore",
        "role": "Recruteur · #373",
        "items": [
            I(
                "Fixture / destinataire SUSPENDED ou BANNED → Candidate statut Inactif (pas Blacklisté)",
                "Souvent via probe GET (searchEmployees = COMPLETED seulement).",
            ),
            I("Ce Candidate disparaît du filtre Disponibilités"),
            I("Blacklisté posé à la main : le sync ne le passe PAS Inactif et ne le restore PAS"),
            I(
                "Restore COMPLETED → statut d’avant Inactif (ex. Qualifié reste Qualifié)",
                "Inactif manuel sans mémoire statusBeforeInactive = pas de restore auto.",
            ),
            I("Après restore : redevient éligible au filtre ; PAS de 2ᵉ SMS auto (tester aussi §11)"),
        ],
    },
    {
        "id": "dispo-public",
        "title": "10. Page publique Weekly availability",
        "role": "Anonyme · /dispo/[token] · #372",
        "items": [
            I(
                "Fiche origine App : bouton « Copier le lien dispos » → toast « Lien copié »",
                "Colle l’URL : /dispo/… (hors dashboard). Token long (pas un id séquentiel).",
            ),
            I("Ouvrir le lien en navigation privée : page « Mes disponibilités » SANS login CRM"),
            I("Grille 1 semaine : Lun→Dim × Matin / Après-midi (pas 4 semaines d’un coup)"),
            I("Boutons « Semaine précédente » / « Semaine suivante » changent la semaine"),
            I("Hint : « Aucune case cochée = indisponible cette semaine »"),
            I("Cocher mercredi Matin → Enregistrer → toast « Disponibilités enregistrées »"),
            I("Changer de semaine puis revenir : mercredi AM toujours coché (historique)"),
            I("Jours passés de la semaine en cours : non cliquables (pas de réécriture d’historique)"),
            I(
                "Enregistrer une semaine sans aucune case = indispo déclarée (exclue du filtre « dispo »)",
                "Différent d’une semaine jamais ouverte (unknown).",
            ),
            I("URL token bidon / trop court → 404, pas de grille"),
            I("Même URL reste valable plus tard (pas de magic link à usage unique)"),
            I("Pas de compte candidat / mot de passe sur cette page"),
        ],
    },
    {
        "id": "sms",
        "title": "11. SMS unique App-validated",
        "role": "Recruteur + infra · #375",
        "items": [
            I(
                "App-validated AVEC tél : un SMS contenant le lien /dispo/… (une fois)",
                "Texte type : « MediJob : indique tes dispos ici {url} ». Burst 1er cron possible. Si Brevo SMS non config → N/A + commente.",
            ),
            I("Sans tél au 1er sync : pas d’envoi ; tél apparaît plus tard → UN envoi (pas deux)"),
            I("Restore Inactif→COMPLETED : PAS de nouvel envoi auto"),
            I(
                "Fiche origine App : « Renvoyer le lien SMS » → toast « SMS renvoyé » (même URL)",
                "Sans tél : « Pas de téléphone sur la fiche ».",
            ),
            I("Pas de cron SMS hebdomadaire (pas de relance « actualise ta semaine »)"),
            I("Candidate origin CRM : pas de bouton renvoyer SMS"),
        ],
    },
    {
        "id": "filter",
        "title": "12. Filtre Disponibilités",
        "role": "Recruteur · /interim/disponibilites · #374",
        "items": [
            I("Formulaire : Date · Créneau AM/PM · Métier · Ville · Rayon (km) · bouton Filtrer"),
            I("Pas de champs logiciel, salaire, type de contrat, NIR"),
            I("Submit GET : l’URL contient date, period, jobTitleId, city, radiusKm"),
            I(
                "Filtrer un mercredi AM + métier d’un Candidate qui a coché ce créneau → il apparaît",
                "Population : origin App, pas Inactif. JobTitle exact (pas matrice compat).",
            ),
            I("Semaine jamais remplie (unknown) : le candidat N’apparaît PAS"),
            I("Semaine enregistrée vide (indispo déclarée) : N’apparaît PAS"),
            I("Inactif : N’apparaît PAS même s’il a des slots"),
            I("Candidate CRM / Qualifié hors app : N’apparaît PAS"),
            I("Rayon vide côté UI envoie 30 km (défaut). Trop loin → absent"),
            I("Carte résultat : nom, métier, ville, tél cliquable (tel:), lien SMS (sms:)"),
            I("Aucun bouton « ajouter au pipeline » / pas de MissionCandidate créé"),
            I("Filtre 0 résultat → « Aucun candidat dispo » + « Aucun origin App avec ce créneau… »"),
        ],
    },
    {
        "id": "missions-bk",
        "title": "13. Missions Badakan (liste)",
        "role": "Recruteur · /interim/missions · #368",
        "items": [
            I("Liste cards : nom d’officine + step (Créée / Staffée / Terminée / Annulée / Brouillon) + période"),
            I("Clic card → /interim/missions/[id] (détail), PAS /missions/[id] CRM"),
            I("Description détail : « Mission Badakan — hors kanban Missions CRM. »"),
            I("Champs : pharmacie, dates/périodes, step visibles"),
            I("Pas de bouton créer / staffer / modifier périodes vers Badakan"),
            I("Kanban /missions inchangé (aucune de ces lignes n’y apparaît comme Mission)"),
        ],
    },
    {
        "id": "applied",
        "title": "14. Postulés SEARCH_APPLIED",
        "role": "Recruteur · détail mission · #368",
        "items": [
            I("Section « Postulés SEARCH_APPLIED » sur le détail"),
            I("0 postulé → « Aucun postulé SEARCH_APPLIED. » (fréquent si tout est CANCELLED côté app)"),
            I("Avec postulé : nom + tél cliquable (tel:) si présent, sinon tiret vide"),
            I("Ce n’est PAS l’inbox Candidatures reçues du site"),
            I("Appeler le postulé ne crée PAS de MissionCandidate CRM"),
        ],
    },
    {
        "id": "officines",
        "title": "15. Vérif officines (Pharmacy + Contact)",
        "role": "Recruteur · /interim/officines · #376 · crm.write",
        "items": [
            I("Liste pending : nom, SIRET, ville ; clic → /interim/officines/[id]"),
            I("Back « Vérif officines » sur la fiche de vérif"),
            I("Champs preview : Nom, SIRET, Adresse, Ville, CP, Contact principal, Email, Tél"),
            I(
                "SIRET déjà en CRM → chip « Pharmacy existante » + lien vers la fiche Pharmacie",
                "Valider = même Pharmacy, pas un second fichier.",
            ),
            I("Nouveau SIRET → chip « Nouvelle Pharmacy »"),
            I(
                "Contact : « Fusionner par email » ou « Fusionner par téléphone » ou « Créer le Contact principal »",
                "Fusion sur la Pharmacy cible. Rôle Titulaire en seed requis (sinon PRECONDITION_FAILED).",
            ),
            I("Bouton « Valider Pharmacy » → toast « Pharmacy validée » → retour liste ; la ligne a quitté le pending"),
            I("Nouvelle : fiche Pharmacie créée en PROSPECT (pas Client auto)"),
            I("Contact principal créé ou setPrimary ; pas de doublon email/tél sur cette officine"),
            I("Pas d’écriture Badakan (pas de PUT enterprise)"),
            I("Mission sans enterprise.id : pas de ligne vérif pour ce shift"),
        ],
    },
    {
        "id": "contrats",
        "title": "16. Contrats Badakan",
        "role": "Recruteur · /interim/contrats · #377",
        "items": [
            I("Liste : destinataire + statut (Brouillon / Créé / Validé / Annulé…) + nom officine"),
            I("Si l’API envoie les URLs : chips PDF et/ou DPAE (nouvel onglet). Sinon chip absent = OK (« si dispo »)"),
            I("Pas de bouton « créer contrat » / pas de mutation"),
            I("Ouvrir Facturation → Intérim (Direction) : AUCUNE ligne auto créée depuis ces contrats"),
            I("Pas de Devis généré depuis un Badakan contract"),
            I("Cards non cliquables vers une fiche write (liste lecture)"),
        ],
    },
    {
        "id": "factu",
        "title": "17. Frontière Facturation Intérim",
        "role": "Direction / RH-Admin · /facturation/interim",
        "items": [
            I("Direction : Facturation → pill Intérim = Lignes de suivi (bouton « Nouvelle mission » = ligne CA)"),
            I("Recruteur : URL /facturation/interim refuse / redirige (pas finance.view)"),
            I("Communication : pas Facturation"),
            I("Créer une Ligne de suivi à la main marche toujours (process finance inchangé)"),
            I("Cette page n’affiche PAS la liste Badakan contracts / missions"),
            I("Module /interim n’a aucun bouton « facturer » / « créer ligne »"),
        ],
    },
    {
        "id": "crm-missions",
        "title": "18. Frontière Missions CRM",
        "role": "Recruteur · /missions",
        "items": [
            I("Kanban / liste Missions CRM : uniquement les besoins créés recruteur"),
            I("Aucune Badakan mission n’apparaît comme Mission (pas de PipelineStage auto)"),
            I("Filtre dispos Intérim n’ajoute personne au pipeline"),
            I("Créer une Mission CRM depuis une Badakan mission = hors V1 (pas de CTA)"),
            I("Matching CDI (logiciels, salaire) inchangé sur /missions"),
        ],
    },
    {
        "id": "roles",
        "title": "19. Rôles",
        "role": "Les 4 rôles + testeur",
        "items": [
            I("Recruteur : lit Intérim (4 sous-pages) + Profils app + CVthèque"),
            I("Recruteur : peut Valider Pharmacy (crm.write) et notes ActivityLog"),
            I("Communication : lit Intérim ; peut aussi confirm vérif (crm.write = tous les rôles métier)"),
            I("Communication : pas Admin, pas Facturation"),
            I("Direction / RH-Admin / Testeur : Intérim + Facturation Intérim"),
            I("Page /dispo/[token] : aucune session requise (rôle N/A)"),
            I("RGPD erase Candidate : Direction/RH-Admin only (bouton existant, pas spécifique Intérim)"),
        ],
    },
    {
        "id": "nowrite",
        "title": "20. Interdits V1 (régressions graves)",
        "role": "Tous · lecture seule Badakan",
        "items": [
            I("Nulle part un bouton Staff / Valider dossier / Rejeter vers Badakan"),
            I("Nulle part POST commentaire vers l’app (notes = ActivityLog CRM)"),
            I("Nulle part création/édition contrat Badakan"),
            I("Nulle part PUT périodes de mission Badakan"),
            I("Pas de relance auto J+2 / J+5 / J+10"),
            I("Pas d’email « profil validé MediJob » comme porte d’entrée du vivier"),
        ],
    },
    {
        "id": "e2e",
        "title": "21. E2E — journée recruteur Intérim",
        "role": "Recruteur · parcours complet (Badakan live)",
        "items": [
            I("Login Recruteur → sidebar Intérim → Missions Badakan (liste ou empty OK)"),
            I("Ouvrir un shift → lire officine / dates / SEARCH_APPLIED ; appeler si tél"),
            I("Vérif officines : valider une Pharmacy (existante ou nouvelle) + Contact"),
            I("Contrats Badakan : statut visible ; PDF si lien"),
            I("CVthèque : ouvrir un origine App (boutons dispos) ; copier le lien"),
            I("Page publique : cocher un créneau futur, enregistrer"),
            I("Intérim → Disponibilités : filtrer ce créneau + métier + ville → le candidat sort"),
            I("Tél / SMS depuis la carte filtre ; vérifier /missions inchangé"),
            I("Historique Candidate : comments Badakan + une note CRM ajoutée"),
            I("Facturation Intérim (compte Direction) : pas de nouvelle ligne surprise"),
        ],
    },
    {
        "id": "edges",
        "title": "22. Cas limites",
        "role": "Recruteur / anonyme",
        "items": [
            I("/interim/missions/id-inconnu → 404"),
            I("/interim/officines/id-inconnu → 404"),
            I("/dispo/abc → 404 (token Zod min 20)"),
            I("Ouvrir /dispo/token pendant que je suis loggé CRM : page publique, pas le dashboard"),
            I("Double-clic Valider Pharmacy : pas deux Pharmacies (idempotent / déjà verified sort du pending)"),
            I("Filtre dispos métier A alors que le candidat est métier B → absent"),
        ],
    },
    {
        "id": "deferred",
        "title": "23. Hors V1 (ne pas tester comme livré)",
        "role": "Différé",
        "items": [
            I("SMS chaque semaine + relance si semaine pas à jour", "", True),
            I("Relances J+2 / J+5 / J+10 + alerte recruteur", "", True),
            I("Email « profil validé » après acceptation MediJob / entretien comme porte", "", True),
            I("Matching logiciels + élargir rayon + « non affecté à une autre mission »", "", True),
            I("Staffer / valider / commenter / écrire un contrat dans Badakan depuis le CRM", "", True),
            I("Créer une Mission CRM depuis une Badakan mission", "", True),
            I("Compte candidat / magic link / Calendly / heures précises", "", True),
            I("Ligne de suivi / Devis / CA auto depuis un Badakan contract", "", True),
        ],
    },
]


def normalize_sections():
    out = []
    for sec in SECTIONS:
        items = []
        for i, it in enumerate(sec["items"]):
            items.append(
                {
                    "id": f"{sec['id']}-{i}",
                    "text": it["text"],
                    "hint": it.get("hint", ""),
                    "deferred": bool(it.get("deferred")),
                }
            )
        out.append({**sec, "items": items})
    return out


def extract_css(shell: str) -> str:
    m = re.search(r"<style>(.*?)</style>", shell, re.S)
    if not m:
        raise SystemExit("CSS introuvable dans testing-manual-v1.html")
    return m.group(1)


def extract_js(shell: str) -> str:
    m = re.search(r"<script>\nconst STORAGE_KEY.*?</script>", shell, re.S)
    if not m:
        raise SystemExit("JS introuvable dans testing-manual-v1.html")
    js = m.group(0)
    js = js.replace(
        'const STORAGE_KEY = "medijob-testing-manual-v1-5";',
        'const STORAGE_KEY = "medijob-testing-interim-v1";',
    )
    js = js.replace("medijob-testing-manual-v1-3", "medijob-testing-interim-v1")
    js = js.replace("medijob-tests-", "medijob-interim-tests-")
    js = js.replace("medijob-bugs-", "medijob-interim-bugs-")
    js = js.replace("# Rapport tests MediJob V1.2", "# Rapport tests MediJob Intérim V1")
    js = js.replace(
        'if (confirm("Recharger le snapshot du 03/08 (59 OK + 24 KO) ?"))',
        'if (confirm("Réinitialiser le préremplissage Intérim (session vide) ?"))',
    )
    return js


def build_html(sections: list) -> str:
    shell = SHELL.read_text(encoding="utf-8")
    css = extract_css(shell)
    js = extract_js(shell)
    data_json = json.dumps(
        {
            "sections": sections,
            "accounts": ACCOUNTS,
            "known": KNOWN,
            "prefill": {
                "session": {
                    "date": "",
                    "tester": "Victor",
                    "url": "https://crm-medijob-web-git-dev-victor-piamias-projects.vercel.app",
                    "seed": "",
                    "ai": "",
                    "verdict": "",
                    "notes": "",
                    "badakan": "",
                    "cron": "",
                    "sms": "",
                },
                "items": {},
                "retestIds": [],
            },
        },
        ensure_ascii=False,
    ).replace("</", "<\\/")
    n = sum(len(s["items"]) for s in sections)
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MediJob — Checklist Intérim V1</title>
<style>{css}</style>
</head>
<body>
<header class="app">
  <div class="row">
    <div>
      <h1>CRM MediJob — Checklist Intérim V1</h1>
      <p>{n} tests · graphe #366–#377 sur DEV · localStorage séparé de la checklist CRM</p>
    </div>
    <div class="actions">
      <button type="button" class="secondary" id="btn-expand">Tout ouvrir</button>
      <button type="button" class="secondary" id="btn-collapse">Tout fermer</button>
      <button type="button" id="btn-export-json">Export JSON</button>
      <button type="button" id="btn-export-csv">Export CSV</button>
      <button type="button" id="btn-export-bugs">Rapport bugs (MD)</button>
      <label class="file-btn secondary">Import JSON<input type="file" id="import-json" accept="application/json,.json" /></label>
      <button type="button" class="secondary" id="btn-restore">Réinit session</button>
      <button type="button" class="danger" id="btn-reset">Vider (tout à faire)</button>
    </div>
  </div>
</header>

<main>
  <div class="banner">
    <h2>Intérim V1 — tout le module (pas le CRM staffing CDI)</h2>
    <p style="margin:0;font-size:.92rem">
      URL : <a href="https://crm-medijob-web-git-dev-victor-piamias-projects.vercel.app">preview git-dev</a>
      · PRD <code>docs/PRD_INTERIM_V1.md</code>
      · Glossaire <code>CONTEXT.md</code>
    </p>
    <ul>
      <li><strong>Ordre conseillé</strong> : env → nav/empty → (si Badakan live) Profils app → fiche origine App → page /dispo → filtre → missions/officines/contrats → Facturation frontière</li>
      <li><strong>Listes vides</strong> avant cron = OK. Sans creds Badakan = N/A sur les items « après sync », pas KO UI</li>
      <li><strong>Ne pas</strong> tester les lignes « Hors V1 » comme des bugs (statut Différé)</li>
      <li>Sauvegarde locale clé <code>medijob-testing-interim-v1</code> (n’écrase pas la checklist V1.5)</li>
    </ul>
  </div>

  <div class="panel">
    <h2>Session</h2>
    <div class="grid-2" id="session-fields">
      <label class="field">Date<input type="text" data-session="date" /></label>
      <label class="field">Testeur<input type="text" data-session="tester" placeholder="Victor" /></label>
      <label class="field">URL testée (doit être git-dev)<input type="url" data-session="url" placeholder="https://crm-medijob-web-git-dev-….vercel.app" /></label>
      <label class="field">Seed users rejoué ?
        <select data-session="seed">
          <option value="">—</option>
          <option>Oui</option>
          <option>Non</option>
          <option>Je ne sais pas</option>
        </select>
      </label>
      <label class="field">Badakan live (EMAIL/PASSWORD) ?
        <select data-session="badakan">
          <option value="">—</option>
          <option>Oui</option>
          <option>Non</option>
          <option>Je ne sais pas</option>
        </select>
      </label>
      <label class="field">Cron Profils app a déjà tourné ?
        <select data-session="cron">
          <option value="">—</option>
          <option>Oui</option>
          <option>Non (listes vides attendues)</option>
          <option>Je ne sais pas</option>
        </select>
      </label>
      <label class="field">SMS Brevo
        <select data-session="sms">
          <option value="">—</option>
          <option>Réel</option>
          <option>Non configuré (N/A)</option>
          <option>Je ne sais pas</option>
        </select>
      </label>
      <label class="field">Verdict
        <select data-session="verdict"><option value="">—</option><option>GO</option><option>NO-GO</option></select>
      </label>
    </div>
    <label class="field" style="margin-top:10px">Notes globales
      <textarea data-session="notes" placeholder="Bloqueurs, captures, personae Badakan utilisées…"></textarea>
    </label>
    <div class="progress-bar"><span id="progress-fill"></span></div>
    <div class="stats" id="stats"></div>
  </div>

  <div class="panel">
    <h2>Comptes (après reseed)</h2>
    <div class="accounts" id="accounts"></div>
  </div>

  <div class="panel">
    <h2>Pièges (lire)</h2>
    <div class="known" id="known"></div>
  </div>

  <div class="panel">
    <h2>Filtres</h2>
    <div class="filters">
      <label><input type="checkbox" id="filter-todo" /> À faire / KO seulement</label>
      <label><input type="checkbox" id="filter-comments" /> Avec commentaire</label>
      <input type="search" id="search" placeholder="Rechercher…" style="flex:1;min-width:180px" />
    </div>
    <div class="toc" id="toc"></div>
  </div>

  <div id="sections"></div>

  <div class="panel bugs-panel">
    <h2>Vue bugs & commentaires</h2>
    <div id="bugs-list"></div>
  </div>
</main>

<footer class="sticky-note">
  <span id="save-state">Sauvegarde locale prête</span>
  <span>Intérim V1 · {n} tests · #366–#377</span>
</footer>

<script id="data" type="application/json">{data_json}</script>
{js}
</body>
</html>
"""


def main() -> None:
    sections = normalize_sections()
    OUT.write_text(build_html(sections), encoding="utf-8")
    n = sum(len(s["items"]) for s in sections)
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes, {n} items, {len(sections)} sections)")


if __name__ == "__main__":
    main()
