#!/usr/bin/env python3
"""Génère docs/testing-manual-v1.html — checklist interactive v2 (retours Victor)."""

from __future__ import annotations

import json
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "testing-manual-v1.html"

SECTIONS = [
    {
        "id": "env",
        "title": "0. Bon environnement (lire avant tout)",
        "role": "Obligatoire",
        "items": [
            {
                "text": "J’utilise l’URL DEV (branche dev), PAS la prod crm-medijob-web.vercel.app (main trop vieux)",
                "hint": "URL recommandée : https://crm-medijob-web-git-dev-victor-piamias-projects.vercel.app — la prod n’a pas forgot-password ni les 4 rôles V1.",
            },
            {
                "text": "Je peux ouvrir /login sur cette URL (SSO Vercel OK si demandé)",
            },
            {
                "text": "Après login Recruteur, je vois le CRM (pas seulement la page login)",
            },
        ],
    },
    {
        "id": "login",
        "title": "1. Connexion (faire en premier)",
        "role": "Tous les comptes",
        "items": [
            {
                "text": "Login Recruteur OK — recruteur@medijob.fr / recruteur-medijob-2026",
                "hint": "Seul compte qui marchait sur l’ancienne prod. Sur DEV après reseed, les 5 comptes doivent marcher.",
            },
            {
                "text": "Login Direction OK — direction@medijob.fr / direction-medijob-2026",
                "hint": "Si KO « Identifiants invalides » → DB pas reseedée. Demander : npm run db:seed:users sur la Neon du preview.",
            },
            {
                "text": "Login Communication OK — communication@medijob.fr / communication-medijob-2026",
            },
            {
                "text": "Login RH-Admin OK — admin@medijob.fr / admin-medijob-2026",
            },
            {
                "text": "Login testeur perso OK — victorpiamiaspro@gmail.com / tester-medijob-2026",
                "hint": "Compte ajouté au seed (rôle RH_ADMIN). Nécessite un reseed DB. Override : SEED_TESTER_PASSWORD.",
            },
            {
                "text": "Mauvais mot de passe → message « Identifiants invalides »",
            },
            {
                "text": "Logout → retour /login",
            },
        ],
    },
    {
        "id": "forgot",
        "title": "1b. Mot de passe oublié (seulement sur DEV)",
        "role": "Après login page",
        "items": [
            {
                "text": "Sous le bouton « Se connecter », je vois le lien « Mot de passe oublié ? Réinitialiser »",
                "hint": "Sur la PROD actuelle ce lien n’existe PAS (main sans #212). Si tu ne le vois pas → mauvaise URL.",
            },
            {
                "text": "Clic → page /forgot-password (formulaire email, PAS redirect vers login)",
            },
            {
                "text": "Je soumets mon email seed → message de confirmation affiché (même si le mail n’arrive pas)",
                "hint": "Attendu UX : message générique « si un compte existe… ». Le vrai mail dépend de Resend/config. Sans mail → statut N/A + commente.",
            },
            {
                "text": "Mail de reset reçu + lien → nouveau MDP → login OK (sinon mets N/A si Resend non configuré)",
                "hint": "Session 03/08 : mail n’arrive pas → c’est N/A infra, pas un bug produit UI. Ne reteste que si Resend est branché.",
            },
        ],
    },
    {
        "id": "post-login-smoke",
        "title": "2. Smoke après login (données seed)",
        "role": "Recruteur connecté",
        "items": [
            {
                "text": "Sidebar visible : Accueil, Candidats, Pharmacies, Contacts, Missions, Offres, Assistant",
            },
            {
                "text": "Pas d’entrée Admin (compte Recruteur)",
            },
            {
                "text": "Au moins 5 pharmacies seed (Bellecour, Marais, Vieux-Port…)",
                "hint": "Si listes vides → seed demo manquant (db:seed / db:seed:demo), pas bloquant pour tester le login.",
            },
            {
                "text": "Statut pharmacie affiché « Client » (pas « Actif »)",
            },
            {
                "text": "≥ 8 candidats en CVthèque",
            },
            {
                "text": "Missions : ≥1 À pourvoir, 1 Pourvu, 1 Annulée",
            },
            {
                "text": "Recherche « Bellecour » → Pharmacie",
            },
            {
                "text": "Recherche « Camille » → Candidat",
            },
        ],
    },
    {
        "id": "loaders",
        "title": "2b. Loaders (design tableau)",
        "role": "Recruteur · listes",
        "items": [
            {
                "text": "Skeleton chargement Candidats / Pharmacies / Missions = TABLEAU (pas cards)",
                "hint": "Hard refresh ou Network throttle pour voir le skeleton. Fix #260.",
            },
        ],
    },
    {
        "id": "accueil",
        "title": "3. Accueil / Dashboard",
        "role": "Recruteur · /accueil",
        "items": [
            "KPI visibles (missions, urgentes, candidatures, taux…)",
            "Chiffres cohérents avec les listes",
            "Centre d’alertes présent",
            "Clic alerte → écran pertinent",
            "Actions rapides OK (si présentes)",
        ],
    },
    {
        "id": "pharmacies-liste",
        "title": "4.1 Pharmacies — Liste",
        "role": "Recruteur · /pharmacies",
        "items": [
            "Tableau (pas seulement cartes)",
            "Colonnes : nom, ville, CP, statut, groupement, date, référent, œil",
            "Statut Client / Prospect / Inactif",
            "Filtres statut, dpt, groupement, LGO, ville, référent…",
            "Filtrer Client → Bellecour ; Prospect → Vieux-Port",
            "Vue rapide (œil) + lien fiche",
            "Toggle carte : pins + filtres",
        ],
    },
    {
        "id": "pharmacies-crud",
        "title": "4.2 Pharmacies — Création / Import / Fiche",
        "role": "Recruteur · /pharmacies",
        "items": [
            "SIRENE/SIRET préremplit nom, SIRET, adresse, ville, CP",
            "Référent prérempli mais optionnel",
            "Création → fiche + historique « Fiche créée »",
            {
                "text": "Import CSV : mapping + preview (sample docs/testing-samples/pharmacies-exemple.csv)",
                "hint": "Fichier d’exemple fourni dans le repo.",
            },
            "Doublon SIRET ou nom+ville+CP → fusion",
            {
                "text": "Après commit import CSV : nouvelles/maj pharmacies visibles dans la liste",
                "hint": "Pas juste le mapping : cliquer Valider/Importer puis vérifier que Bellecour (ou la ligne du CSV) apparaît/est à jour.",
            },
            "Onglets Infos, Contacts, Besoins, Historique, Documents",
            "Édition Infos → « Fiche modifiée » dans historique",
            {
                "text": "Onglet Besoins : seulement missions ouvertes (pas Pourvu/Annulée) + type contrat visible",
                "hint": "Ouvre une pharmacie seed → Besoins. Tu dois voir les missions encore à pourvoir, avec CDI/CDD/… Les missions terminées ne doivent PAS être là.",
            },
            {
                "text": "Onglet Historique : actions auto (créé/modifié) + missions passées Pourvu ou Annulée y apparaissent",
                "hint": "Ce n’est pas un chat libre : c’est la timeline. Après une mission Pourvu sur cette pharmacie, une ligne doit remonter ici.",
            },
            "Documents : upload + aperçu + téléchargement",
            {
                "text": "Soft delete pharmacie : bouton visible Direction/RH-Admin/Testeur ; absent ou refusé pour Recruteur",
                "hint": "Session 03/08 : bouton introuvable même en admin → bug. Chercher menu ⋮ / Actions / Supprimer sur la fiche.",
            },
        ],
    },
    {
        "id": "contacts",
        "title": "5. Contacts",
        "role": "Recruteur · /contacts",
        "items": [
            "Colonnes nom et prénom séparés",
            "Fonction, pharmacie, tél, email, date, principal, œil",
            "Filtres rôle / pharmacie / ville / référent / principal",
            "Vue rapide OK",
            "Création : pharmacie obligatoire",
            "Rôle depuis référentiel",
            "Référent optionnel",
            "Fiche : édition + historique + documents + soft delete selon rôle",
        ],
    },
    {
        "id": "candidats-liste",
        "title": "6.1 Candidats — Liste",
        "role": "Recruteur · /candidats",
        "items": [
            "Colonnes identité + métier + ville + statut + date + œil",
            "Filtres métier / dispo / ville / mobilité / statut / référent",
            "Vue rapide + toggle carte",
            "Export CSV des lignes filtrées (si bouton)",
            {
                "text": "Zone candidatures reçues = TABLEAU (pas cards)",
                "hint": "Onglet Candidatures reçues — même design liste que CVthèque. Fix #260.",
            },
        ],
    },
    {
        "id": "candidats-crud",
        "title": "6.2 Candidats — Création / Fiche",
        "role": "Recruteur · /candidats",
        "items": [
            "Création : statut Nouveau + prétentions salaire",
            "Doublon email / nom+tél → alerte ou fusion",
            {
                "text": "Import CV PDF/JPEG → revue → création (+ toast si doublon)",
                "hint": "Formats PDF PNG JPG WEBP. Doublon existant → toast avant formulaire.",
            },
            {
                "text": "Import CSV candidats OK",
                "hint": "Sample : docs/testing-samples/candidats-exemple.csv",
            },
            "Édition profil complète",
            "Bandeau profil incomplet si champs manquants",
            {
                "text": "Rattacher le candidat à une mission ouverte → son statut passe auto à « En mission »",
                "hint": "Fiche candidat ou pipeline mission : ajoute le candidat. Recharge la fiche → statut = En mission (sauf s’il est Blacklisté).",
            },
            {
                "text": "Statut Blacklisté : hint + chip header ; blacklisté ne repasse PAS en En mission",
                "hint": "Select statut fin de liste + aide. Fiche BLACKLISTE → chip header.",
            },
            {
                "text": "Résumé IA : après generate → « Enregistré » ; edit → « Enregistrer » actif",
                "hint": "Plus de bouton gris mystère après auto-save generate. Fix #260.",
            },
            {
                "text": "Profil anonymisé visible + export PDF anonymisé",
                "hint": "Raccourcis sur onglet Profil.",
            },
            {
                "text": "Présenter pharmacie / périmètre : noms contacts + mailto OK",
                "hint": "Destinataire avec nom · BCC périmètre avec noms. Fix #260.",
            },
            "Historique + onglet missions",
            {
                "text": "Documents upload + aperçu + CV accessible",
            },
            {
                "text": "Effacement RGPD : bouton bien visible · Direction/RH-Admin only",
                "hint": "Bouton plus grand. Fix #260.",
            },
        ],
    },
    {
        "id": "missions",
        "title": "7. Missions & Matching",
        "role": "Recruteur · /missions",
        "items": [
            "Tableau missions + colonnes attendues",
            "Toggle kanban optionnel",
            "Filtres contrat / statut / métier / ville / période",
            "Vue rapide + carte",
            {
                "text": "Création mission : champ « Profil recherché » + après save ouverture de la fiche mission",
                "hint": "Session 03/08 : après création, pas de redirect vers la fiche → bug navigation.",
            },
            "Édition + pipeline candidats",
            {
                "text": "Passer mission Pourvu/Annulée : pipeline candidats reste visible / cohérent",
                "hint": "Session 03/08 : passage Pourvu OK mais pipeline se vide → bug.",
            },
            "Documents + historique + soft delete selon rôle",
            "Matching : suggestions scorées",
            "Prétentions prises en compte / score cohérent",
            "Multi-select 2 candidats",
            "Deep links email / SMS / WhatsApp",
            "Ajouter au pipeline → stage initial",
        ],
    },
    {
        "id": "offres",
        "title": "8. Offres",
        "role": "Recruteur · /offres",
        "items": [
            "Vraie liste (plus de placeholder)",
            "Colonnes titre, statut, mission, nb candidatures",
            "Générer offre IA depuis mission → brouillon",
            "Publier → PUBLIEE ; Dépublier → DEPUBLIEE",
        ],
    },
    {
        "id": "assistant",
        "title": "9. Assistant IA",
        "role": "Recruteur · /assistant",
        "items": [
            "Chat libre répond (mock OK)",
            "Raccourcis résumé candidat / pharmacie",
            "Raccourcis mail candidat / pharmacie",
            "Générer offre (contexte mission)",
            "Rapport semaine : chiffres cohérents",
            "Meilleurs profils s’appuie sur matching",
        ],
    },
    {
        "id": "admin",
        "title": "10. Admin & RGPD",
        "role": "RH-Admin / Direction / Testeur · /admin",
        "items": [
            "Recruteur/Communication : Admin interdit",
            "CRUD Pipeline (+ ordre)",
            "CRUD Logiciels LGO",
            "CRUD Groupements",
            "CRUD Métiers + matrice compatibilité",
            "CRUD Rôles contact",
            "Utilisateurs : créer / rôle / soft delete (garder ≥1 admin)",
            "Page RGPD accessible",
            "Lien registre externe si configuré",
            "Trace effacements visible si UI",
        ],
    },
    {
        "id": "roles",
        "title": "11. Matrice des rôles",
        "role": "Les 4 rôles + testeur",
        "items": [
            "Direction : voit Admin",
            "RH-Admin / Testeur : voit Admin",
            "Recruteur : PAS Admin",
            "Communication : PAS Admin",
            "Soft delete : Direction OK",
            "Soft delete : RH-Admin OK",
            "Soft delete : Recruteur NON",
            "Soft delete : Communication NON",
            "RGPD erase : Direction/RH-Admin OK ; autres NON",
            "Publier offre : les rôles métier OK (ou noter écart)",
            "Communication write CRM : noter comportement réel vs lecture seule",
            "Matching+rattacher Communication : attendu NON — vérifier",
        ],
    },
    {
        "id": "e2e-a",
        "title": "12.A E2E — Staffing classique",
        "role": "Recruteur",
        "items": [
            "Ouvrir/créer pharmacie Client",
            "Vérifier/ajouter contact titulaire",
            "Créer mission CDI + profil recherché",
            "Matching → choisir candidat",
            "Rattacher au pipeline (+ mailto optionnel)",
            "Avancer d’un stage pipeline",
            "Générer offre IA → publier CRM",
            "Passer mission Pourvu",
            "Pharmacie : besoin disparu + historique",
            "Candidat : En mission + historique",
        ],
    },
    {
        "id": "e2e-b",
        "title": "12.B E2E — CVthèque",
        "role": "Recruteur",
        "items": [
            "Import CV PDF → revue → création",
            "Compléter mobilité/ville si bandeau",
            "Résumé IA + PDF anonymisé",
            "Présenter à une pharmacie",
        ],
    },
    {
        "id": "e2e-c",
        "title": "12.C E2E — Qualité données",
        "role": "Recruteur",
        "items": [
            "Doublon email candidat géré",
            "Import CSV pharmacie SIRET doublon → fusion",
        ],
    },
    {
        "id": "deferred",
        "title": "13. Différé (pas encore livré)",
        "role": "Plus tard",
        "items": [
            {"text": "#226 Section entretien sur création/fiche", "deferred": True},
            {"text": "#226 Champs entretien sauvegardés", "deferred": True},
            {"text": "#230 Publish crée/maj item site (Webflow)", "deferred": True},
            {"text": "#230 Unpublish retire côté site", "deferred": True},
            {"text": "#231 Webhook → Application inbox", "deferred": True},
            {"text": "#231 Accept → Candidate+CV ; Refus → REFUSEE", "deferred": True},
            {"text": "#234 Écrans finance / factu / devis", "deferred": True},
            {"text": "#234 CA/Marge : Direction+RH-Admin only", "deferred": True},
        ],
    },
]

ACCOUNTS = [
    ("⭐ Recruteur", "recruteur@medijob.fr", "recruteur-medijob-2026"),
    ("Direction", "direction@medijob.fr", "direction-medijob-2026"),
    ("Communication", "communication@medijob.fr", "communication-medijob-2026"),
    ("RH-Admin", "admin@medijob.fr", "admin-medijob-2026"),
    ("👤 Toi (testeur)", "victorpiamiaspro@gmail.com", "tester-medijob-2026"),
]

KNOWN = [
    (
        "Fixes #259+#260 — lignes orange = À RETESTER",
        "Loaders table · inbox liste · résumé Enregistré · mailto noms · RGPD bouton · CV JPEG+doublon toast · blacklist chip · CSV samples · + batch #259.",
    ),
    (
        "OK du 03/08 conservés",
        "Login, smoke, contacts, etc. restent OK — ne reteste PAS tout. Filtre « À faire / KO seulement ».",
    ),
    (
        "Encore ouverts (KO / hors scope)",
        "Besoins/Historique pharmacies (clarif) · Offres/Assistant/Admin/rôles jamais joués · reset mail = N/A Resend.",
    ),
]


def normalize_sections():
    out = []
    for sec in SECTIONS:
        items = []
        for i, it in enumerate(sec["items"]):
            if isinstance(it, str):
                items.append(
                    {"id": f"{sec['id']}-{i}", "text": it, "hint": "", "deferred": False}
                )
            else:
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


RETEST_IDS = {
    # #259
    "pharmacies-liste-3",
    "pharmacies-liste-6",
    "pharmacies-crud-3",  # CSV sample file
    "pharmacies-crud-4",
    "pharmacies-crud-11",
    "candidats-liste-1",
    "candidats-liste-2",
    "candidats-crud-0",
    "candidats-crud-1",
    "candidats-crud-2",
    "candidats-crud-3",  # CSV sample file
    "candidats-crud-7",
    "candidats-crud-9",
    "candidats-crud-12",
    "missions-3",
    "missions-4",
    "missions-6",
    "missions-8",
    "missions-11",
    # #260
    "loaders-0",
    "candidats-liste-4",  # inbox table
    "candidats-crud-8",  # résumé Enregistré
    "candidats-crud-10",  # mailto noms + périmètre
    "candidats-crud-13",  # RGPD bouton
}


def load_prefill() -> dict:
    snap = Path(__file__).resolve().parents[1] / "testing-results" / "progress-snapshot-v1.json"
    if not snap.exists():
        return {"session": {}, "items": {}, "retestIds": sorted(RETEST_IDS)}
    data = json.loads(snap.read_text(encoding="utf-8"))
    items = data.get("items", {})
    # Mail reset = N/A infra (pas KO produit)
    if "forgot-3" in items:
        items["forgot-3"] = {
            **items["forgot-3"],
            "status": "na",
            "checked": False,
            "comment": (items["forgot-3"].get("comment") or "")
            + " → reclasé N/A (Resend non configuré)",
        }
    for item_id in RETEST_IDS:
        if item_id not in items:
            continue
        prev = items[item_id]
        comment = (prev.get("comment") or "").strip()
        prefix = "[FIX — à retester] "
        items[item_id] = {
            "status": "todo",
            "checked": False,
            "comment": comment if comment.startswith(prefix) else f"{prefix}{comment}".strip(),
        }
    session = dict(data.get("session") or {})
    session["verdict"] = "NO-GO"
    session["url"] = "https://crm-medijob-web-git-dev-victor-piamias-projects.vercel.app"
    session["notes"] = (
        (session.get("notes") or "")
        + "\n\n[v1.5] Fixes #259+#260 — OK 03/08 gardés · orange = À RETESTER seulement. Reseed maps: npm run db:seed"
    ).strip()
    session["date"] = "2026-08-04"
    # Ensure new retest ids exist even if absent from snapshot
    for item_id in RETEST_IDS:
        if item_id not in items:
            items[item_id] = {
                "status": "todo",
                "checked": False,
                "comment": "[FIX — à retester] #259/#260",
            }
    # Never-played modules stay Différé (don't flood « À faire »)
    for item_id, row in list(items.items()):
        if any(
            item_id.startswith(p)
            for p in ("offres-", "assistant-", "admin-", "roles-", "e2e-")
        ):
            if row.get("status") == "todo":
                items[item_id] = {
                    "status": "deferred",
                    "checked": False,
                    "comment": (row.get("comment") or "").strip()
                    or "Hors retest V1 — session séparée",
                }
    return {
        "session": session,
        "items": items,
        "source": str(snap.name),
        "retestIds": sorted(RETEST_IDS),
    }


def build_html(sections: list) -> str:
    prefill = load_prefill()
    data_json = json.dumps(
        {
            "sections": sections,
            "accounts": ACCOUNTS,
            "known": KNOWN,
            "prefill": prefill,
        },
        ensure_ascii=False,
    ).replace("</", "<\\/")

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MediJob — Checklist tests V1.2</title>
<style>
  :root {{
    --teal: #0d736b; --teal-dark: #085950; --mint: #e6f4f2;
    --bg: #f4f6f5; --card: #fff; --text: #1a1a1a; --muted: #5c6570;
    --border: #e2e6ea; --ok: #1b7f4a; --ok-bg: #e8f7ee;
    --ko: #b42318; --ko-bg: #fdecea; --na: #667085; --na-bg: #f2f4f7;
    --def: #b54708; --def-bg: #fff4e5; --warn: #93370d; --warn-bg: #fffaeb;
    --shadow: 0 1px 2px rgba(16,24,40,.06), 0 4px 12px rgba(16,24,40,.04);
    --radius: 12px; --font: "Segoe UI", system-ui, -apple-system, sans-serif;
  }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; font-family: var(--font); background: var(--bg); color: var(--text); line-height: 1.45; }}
  header.app {{
    position: sticky; top: 0; z-index: 40;
    background: linear-gradient(135deg, var(--teal), var(--teal-dark));
    color: #fff; padding: 14px 20px; box-shadow: var(--shadow);
  }}
  header.app .row {{
    display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
    justify-content: space-between; max-width: 1100px; margin: 0 auto;
  }}
  header h1 {{ margin: 0; font-size: 1.15rem; font-weight: 700; }}
  header p {{ margin: 2px 0 0; opacity: .9; font-size: .85rem; }}
  .actions {{ display: flex; flex-wrap: wrap; gap: 8px; }}
  button, .file-btn {{
    border: 0; border-radius: 8px; padding: 8px 12px; font: inherit;
    font-size: .85rem; font-weight: 600; cursor: pointer;
    background: #fff; color: var(--teal-dark);
  }}
  button.secondary {{ background: rgba(255,255,255,.15); color: #fff; border: 1px solid rgba(255,255,255,.35); }}
  button.danger {{ color: var(--ko); }}
  .file-btn {{ display: inline-flex; align-items: center; }}
  .file-btn input {{ display: none; }}
  main {{ max-width: 1100px; margin: 0 auto; padding: 20px 16px 80px; }}
  .banner {{
    background: var(--warn-bg); border: 1px solid #f79009; border-radius: var(--radius);
    padding: 14px 16px; margin-bottom: 16px;
  }}
  .banner h2 {{ margin: 0 0 8px; font-size: 1rem; color: var(--warn); }}
  .banner a {{ color: var(--teal-dark); font-weight: 700; word-break: break-all; }}
  .banner ul {{ margin: 8px 0 0; padding-left: 18px; }}
  .banner li {{ margin: 4px 0; font-size: .9rem; }}
  .panel {{
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px; margin-bottom: 16px;
    box-shadow: var(--shadow);
  }}
  .panel h2 {{ margin: 0 0 12px; font-size: 1.05rem; color: var(--teal-dark); }}
  .grid-2 {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; }}
  label.field {{ display: flex; flex-direction: column; gap: 4px; font-size: .8rem; color: var(--muted); font-weight: 600; }}
  input[type=text], input[type=url], select, textarea {{
    font: inherit; padding: 8px 10px; border: 1px solid var(--border);
    border-radius: 8px; background: #fff; color: var(--text);
  }}
  textarea {{ width: 100%; min-height: 56px; resize: vertical; }}
  .accounts {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 10px; }}
  .account {{ background: var(--mint); border-radius: 10px; padding: 10px 12px; font-size: .85rem; }}
  .account strong {{ display: block; color: var(--teal-dark); margin-bottom: 4px; }}
  .account code {{ font-size: .8rem; }}
  .known {{ display: grid; gap: 8px; }}
  .known .k {{ background: #fff; border-left: 4px solid #f79009; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border); border-left-width: 4px; }}
  .known .k strong {{ display: block; margin-bottom: 4px; font-size: .9rem; }}
  .known .k span {{ font-size: .85rem; color: var(--muted); }}
  .progress-bar {{ height: 10px; background: #e8ecef; border-radius: 999px; overflow: hidden; margin-top: 8px; }}
  .progress-bar > span {{ display: block; height: 100%; background: linear-gradient(90deg, #12b76a, var(--teal)); width: 0%; transition: width .2s; }}
  .stats {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; font-size: .8rem; font-weight: 600; }}
  .pill {{ padding: 4px 10px; border-radius: 999px; background: var(--na-bg); color: var(--na); }}
  .pill.ok {{ background: var(--ok-bg); color: var(--ok); }}
  .pill.ko {{ background: var(--ko-bg); color: var(--ko); }}
  .pill.todo {{ background: #eef2ff; color: #3538cd; }}
  .pill.def {{ background: var(--def-bg); color: var(--def); }}
  .toc {{ display: flex; flex-wrap: wrap; gap: 6px; }}
  .toc a {{
    text-decoration: none; font-size: .75rem; font-weight: 600;
    padding: 6px 10px; border-radius: 999px; background: var(--mint); color: var(--teal-dark);
  }}
  .toc a.done {{ background: var(--ok-bg); color: var(--ok); }}
  .toc a.has-ko {{ background: var(--ko-bg); color: var(--ko); }}
  section.block {{
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); margin-bottom: 14px; overflow: hidden; box-shadow: var(--shadow);
  }}
  details > summary {{
    list-style: none; cursor: pointer; display: flex; gap: 12px; align-items: center;
    justify-content: space-between; padding: 14px 16px; background: #fafbfa; border-bottom: 1px solid var(--border);
  }}
  details > summary::-webkit-details-marker {{ display: none; }}
  .block-title {{ font-weight: 700; font-size: .98rem; }}
  .block-meta {{ font-size: .78rem; color: var(--muted); margin-top: 2px; }}
  .item {{
    display: grid; grid-template-columns: 28px 1fr 130px; gap: 10px; align-items: start;
    padding: 12px 16px; border-bottom: 1px solid var(--border);
  }}
  .item:last-child {{ border-bottom: 0; }}
  .item.done {{ background: #f7fbf8; }}
  .item.failed {{ background: var(--ko-bg); }}
  .item.skipped {{ background: var(--na-bg); }}
  .item.retest-row {{
    background: #fff7ed;
    box-shadow: inset 4px 0 0 #f97316;
  }}
  .badge-retest {{
    display: inline-block; font-size: .7rem; font-weight: 700; padding: 2px 6px;
    border-radius: 6px; background: #ffedd5; color: #c2410c; margin-left: 6px;
  }}
  .item label.check {{ display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: .92rem; }}
  .item input[type=checkbox] {{ width: 18px; height: 18px; margin-top: 2px; accent-color: var(--teal); flex-shrink: 0; }}
  .hint {{ margin: 6px 0 0; font-size: .8rem; color: var(--muted); background: #f8faf9; padding: 6px 8px; border-radius: 6px; }}
  .badge-def {{ display: inline-block; font-size: .7rem; font-weight: 700; padding: 2px 6px; border-radius: 6px; background: var(--def-bg); color: var(--def); margin-left: 6px; }}
  .status {{ width: 100%; }}
  .comment-wrap {{ grid-column: 2 / -1; }}
  .comment-wrap textarea {{ min-height: 42px; font-size: .85rem; background: #fcfcfd; }}
  .filters {{ display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px; }}
  .filters label {{ font-size: .8rem; font-weight: 600; color: var(--muted); }}
  .bugs-panel .bug {{ border: 1px solid var(--border); border-radius: 10px; padding: 10px; margin-bottom: 8px; background: #fff; }}
  .bugs-panel .bug.ko {{ border-color: #f3b4ae; background: #fff8f7; }}
  footer.sticky-note {{
    position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid var(--border);
    padding: 8px 16px; font-size: .8rem; color: var(--muted);
    display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap;
  }}
  @media (max-width: 720px) {{
    .item {{ grid-template-columns: 28px 1fr; }}
    .status {{ grid-column: 2; }}
  }}
</style>
</head>
<body>
<header class="app">
  <div class="row">
    <div>
      <h1>CRM MediJob — Checklist tests V1.5</h1>
      <p>OK 03/08 gardés · orange = fixes #259+#260 à retester · seed maps si besoin</p>
    </div>
    <div class="actions">
      <button type="button" class="secondary" id="btn-expand">Tout ouvrir</button>
      <button type="button" class="secondary" id="btn-collapse">Tout fermer</button>
      <button type="button" id="btn-export-json">Export JSON</button>
      <button type="button" id="btn-export-csv">Export CSV</button>
      <button type="button" id="btn-export-bugs">Rapport bugs (MD)</button>
      <label class="file-btn secondary">Import JSON<input type="file" id="import-json" accept="application/json,.json" /></label>
      <button type="button" class="secondary" id="btn-restore">Recharger snapshot 03/08</button>
      <button type="button" class="danger" id="btn-reset">Vider (tout à faire)</button>
    </div>
  </div>
</header>

<main>
  <div class="banner">
    <h2>🔧 Fixes #259+#260 — reteste UNIQUEMENT les lignes orange</h2>
    <p style="margin:0;font-size:.92rem">
      <strong>OK du 03/08</strong> conservés (ne reteste pas) ·
      <strong>orange</strong> = à revalider ·
      filtre « À faire / KO seulement » recommandé.
    </p>
    <ul>
      <li>#259 : filtres · maps · fusion · soft delete · consent · CV JPEG · redirect mission · pipeline · Gmail</li>
      <li>#260 : loaders table · inbox liste · résumé Enregistré · mailto noms · RGPD · doublon CV · blacklist · CSV samples</li>
      <li>Storage V1.5 — ouvre frais / « Recharger snapshot » pour repartir du préremplissage</li>
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
      <label class="field">IA
        <select data-session="ai"><option value="">—</option><option>Mock</option><option>Réel</option></select>
      </label>
      <label class="field">Verdict (après smoke login)
        <select data-session="verdict"><option value="">—</option><option>GO</option><option>NO-GO</option></select>
      </label>
    </div>
    <label class="field" style="margin-top:10px">Notes globales
      <textarea data-session="notes" placeholder="Bloqueurs, captures, questions…"></textarea>
    </label>
    <div class="progress-bar"><span id="progress-fill"></span></div>
    <div class="stats" id="stats"></div>
  </div>

  <div class="panel">
    <h2>Comptes (après reseed)</h2>
    <div class="accounts" id="accounts"></div>
  </div>

  <div class="panel">
    <h2>Retours déjà diagnostiqués</h2>
    <div class="known" id="known"></div>
  </div>

  <div class="panel">
    <h2>Filtres</h2>
    <div class="filters">
      <label><input type="checkbox" id="filter-todo" checked /> À faire / KO seulement</label>
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
  <span>V1.5 · OK 03/08 gardés · orange = À RETESTER</span>
</footer>

<script id="data" type="application/json">{data_json}</script>
<script>
const STORAGE_KEY = "medijob-testing-manual-v1-5";
const DATA = JSON.parse(document.getElementById("data").textContent);
const RETEST = new Set((DATA.prefill && DATA.prefill.retestIds) || []);

function clonePrefill() {{
  const p = DATA.prefill || {{ session: {{}}, items: {{}} }};
  return {{
    session: JSON.parse(JSON.stringify(p.session || {{}})),
    items: JSON.parse(JSON.stringify(p.items || {{}})),
    updatedAt: null,
  }};
}}

function loadState() {{
  try {{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  }} catch (e) {{}}
  return clonePrefill();
}}
const state = loadState();

function defaultItemState(deferred) {{
  return {{ checked: false, status: deferred ? "deferred" : "todo", comment: "" }};
}}
function saveState() {{
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  document.getElementById("save-state").textContent = "Sauvé · " + new Date().toLocaleTimeString("fr-FR");
  updateStats(); renderBugs(); updateToc();
}}
function getItem(id, deferred) {{
  if (!state.items[id]) state.items[id] = defaultItemState(deferred);
  return state.items[id];
}}
function escapeHtml(s) {{
  return String(s || "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}}
function renderAccounts() {{
  document.getElementById("accounts").innerHTML = DATA.accounts.map(([role, email, pwd]) => `
    <div class="account"><strong>${{role}}</strong>
      <div><code>${{email}}</code></div><div><code>${{pwd}}</code></div></div>`).join("");
}}
function renderKnown() {{
  document.getElementById("known").innerHTML = DATA.known.map(([t, d]) => `
    <div class="k"><strong>${{escapeHtml(t)}}</strong><span>${{escapeHtml(d)}}</span></div>`).join("");
}}
function bindSession() {{
  document.querySelectorAll("[data-session]").forEach((el) => {{
    const key = el.getAttribute("data-session");
    el.value = state.session[key] || "";
    el.addEventListener("input", () => {{ state.session[key] = el.value; saveState(); }});
  }});
  if (!state.session.date) {{
    const today = new Date().toISOString().slice(0, 10);
    const el = document.querySelector('[data-session="date"]');
    el.value = today; state.session.date = today;
  }}
}}
function statusOptions(current) {{
  return [["todo","À faire"],["ok","OK"],["ko","KO"],["na","N/A"],["deferred","Différé"]]
    .map(([v,l]) => `<option value="${{v}}" ${{current===v?"selected":""}}>${{l}}</option>`).join("");
}}
function applyRowClass(row, status) {{
  row.classList.remove("done","failed","skipped","deferred-row","retest-row");
  if (RETEST.has(row.dataset.id) && status === "todo") row.classList.add("retest-row");
  if (status === "ok") row.classList.add("done");
  if (status === "ko") row.classList.add("failed");
  if (status === "na") row.classList.add("skipped");
  if (status === "deferred") row.classList.add("deferred-row");
}}
function sectionNeedsWork(sec) {{
  return sec.items.some((it) => {{
    const s = getItem(it.id, it.deferred).status;
    return s === "todo" || s === "ko";
  }});
}}
function renderSections() {{
  const root = document.getElementById("sections");
  const toc = document.getElementById("toc");
  root.innerHTML = ""; toc.innerHTML = "";
  DATA.sections.forEach((sec) => {{
    const details = document.createElement("details");
    details.className = "block"; details.id = "sec-" + sec.id;
    details.open = sectionNeedsWork(sec);
    const done = sec.items.filter((it) => ["ok","na","deferred"].includes(getItem(it.id, it.deferred).status)).length;
    details.innerHTML = `<summary><div><div class="block-title">${{sec.title}}</div>
      <div class="block-meta">${{sec.role}} · <span data-sec-progress="${{sec.id}}">${{done}}/${{sec.items.length}}</span></div></div>
      <span class="pill todo" data-sec-pill="${{sec.id}}">${{done}}/${{sec.items.length}}</span></summary>
      <div class="items"></div>`;
    const itemsRoot = details.querySelector(".items");
    sec.items.forEach((it) => {{
      const st = getItem(it.id, it.deferred);
      const row = document.createElement("div");
      row.className = "item"; row.dataset.id = it.id; row.dataset.status = st.status;
      applyRowClass(row, st.status);
      row.innerHTML = `
        <div></div>
        <div class="text-col">
          <label class="check">
            <input type="checkbox" ${{st.checked || st.status==="ok" ? "checked" : ""}} />
            <span>${{escapeHtml(it.text)}}${{it.deferred ? '<span class="badge-def">DIFFÉRÉ</span>' : ""}}${{RETEST.has(it.id) ? '<span class="badge-retest">À RETESTER</span>' : ""}}</span>
          </label>
          ${{it.hint ? `<div class="hint">💡 ${{escapeHtml(it.hint)}}</div>` : ""}}
        </div>
        <select class="status">${{statusOptions(st.status)}}</select>
        <div class="comment-wrap"><textarea placeholder="Commentaire / bug / URL…">${{escapeHtml(st.comment)}}</textarea></div>`;
      const cb = row.querySelector('input[type=checkbox]');
      const sel = row.querySelector("select");
      const ta = row.querySelector("textarea");
      cb.addEventListener("change", () => {{
        const cur = getItem(it.id, it.deferred);
        cur.checked = cb.checked;
        if (cb.checked && (cur.status === "todo" || cur.status === "deferred")) {{ cur.status = "ok"; sel.value = "ok"; }}
        if (!cb.checked && cur.status === "ok") {{ cur.status = it.deferred ? "deferred" : "todo"; sel.value = cur.status; }}
        applyRowClass(row, cur.status); row.dataset.status = cur.status; saveState();
      }});
      sel.addEventListener("change", () => {{
        const cur = getItem(it.id, it.deferred);
        cur.status = sel.value; cur.checked = sel.value === "ok"; cb.checked = cur.checked;
        applyRowClass(row, cur.status); row.dataset.status = cur.status; saveState();
      }});
      ta.addEventListener("input", () => {{ getItem(it.id, it.deferred).comment = ta.value; saveState(); }});
      itemsRoot.appendChild(row);
    }});
    root.appendChild(details);
    const a = document.createElement("a");
    a.href = "#sec-" + sec.id;
    a.textContent = sec.title.replace(/^\\d+[a-zA-Z]?\\.\\s*/, "").slice(0, 32);
    a.dataset.toc = sec.id; toc.appendChild(a);
  }});
}}
function allItemsFlat() {{
  const out = [];
  DATA.sections.forEach((sec) => sec.items.forEach((it) => out.push({{ section: sec.title, sectionId: sec.id, ...it, state: getItem(it.id, it.deferred) }})));
  return out;
}}
function updateStats() {{
  const items = allItemsFlat();
  const total = items.length;
  const ok = items.filter((i) => i.state.status === "ok").length;
  const ko = items.filter((i) => i.state.status === "ko").length;
  const na = items.filter((i) => i.state.status === "na").length;
  const def = items.filter((i) => i.state.status === "deferred").length;
  const todo = items.filter((i) => i.state.status === "todo").length;
  const withComment = items.filter((i) => (i.state.comment || "").trim()).length;
  const pct = total ? Math.round(((ok + na + def) / total) * 100) : 0;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("stats").innerHTML = `
    <span class="pill todo">${{pct}}% traité</span>
    <span class="pill ok">OK ${{ok}}</span>
    <span class="pill ko">KO ${{ko}}</span>
    <span class="pill">N/A ${{na}}</span>
    <span class="pill def">Différé ${{def}}</span>
    <span class="pill">À faire ${{todo}}</span>
    <span class="pill">Commentaires ${{withComment}}</span>`;
  DATA.sections.forEach((sec) => {{
    const done = sec.items.filter((it) => ["ok","na","deferred"].includes(getItem(it.id, it.deferred).status)).length;
    const el = document.querySelector(`[data-sec-progress="${{sec.id}}"]`);
    const pill = document.querySelector(`[data-sec-pill="${{sec.id}}"]`);
    if (el) el.textContent = `${{done}}/${{sec.items.length}}`;
    if (pill) {{
      const hasKo = sec.items.some((it) => getItem(it.id, it.deferred).status === "ko");
      pill.textContent = `${{done}}/${{sec.items.length}}`;
      pill.className = "pill " + (hasKo ? "ko" : done === sec.items.length ? "ok" : "todo");
    }}
  }});
}}
function updateToc() {{
  DATA.sections.forEach((sec) => {{
    const a = document.querySelector(`[data-toc="${{sec.id}}"]`);
    if (!a) return;
    const hasKo = sec.items.some((it) => getItem(it.id, it.deferred).status === "ko");
    const done = sec.items.every((it) => ["ok","na","deferred"].includes(getItem(it.id, it.deferred).status));
    a.classList.toggle("has-ko", hasKo);
    a.classList.toggle("done", done && !hasKo);
  }});
}}
function renderBugs() {{
  const root = document.getElementById("bugs-list");
  const items = allItemsFlat().filter((i) => i.state.status === "ko" || (i.state.comment || "").trim());
  if (!items.length) {{
    root.innerHTML = '<p style="color:var(--muted);font-size:.9rem">Aucun KO / commentaire pour l’instant.</p>';
    return;
  }}
  root.innerHTML = items.map((i) => `
    <div class="bug ${{i.state.status === "ko" ? "ko" : ""}}">
      <div style="font-size:.75rem;color:var(--muted);font-weight:700;margin-bottom:4px">${{escapeHtml(i.section)}} · ${{i.state.status.toUpperCase()}}</div>
      <div style="font-weight:600;margin-bottom:4px">${{escapeHtml(i.text)}}</div>
      <div style="font-size:.9rem;white-space:pre-wrap">${{i.state.comment ? escapeHtml(i.state.comment) : '<span style="color:var(--muted)">Pas de commentaire</span>'}}</div>
    </div>`).join("");
}}
function applyFilters() {{
  const onlyTodo = document.getElementById("filter-todo").checked;
  const onlyComments = document.getElementById("filter-comments").checked;
  const q = document.getElementById("search").value.trim().toLowerCase();
  document.querySelectorAll(".item").forEach((row) => {{
    const status = row.dataset.status;
    const text = row.textContent.toLowerCase();
    const comment = row.querySelector("textarea").value.trim();
    let show = true;
    if (onlyTodo && !(status === "todo" || status === "ko")) show = false;
    if (onlyComments && !comment) show = false;
    if (q && !text.includes(q)) show = false;
    row.style.display = show ? "" : "none";
  }});
}}
function download(filename, content, type) {{
  const blob = new Blob([content], {{ type }});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}}
function exportJson() {{
  const payload = {{
    meta: {{ exportedAt: new Date().toISOString(), tool: "medijob-testing-manual-v1-3" }},
    session: state.session,
    items: allItemsFlat().map((i) => ({{
      id: i.id, section: i.section, text: i.text, deferred: i.deferred,
      status: i.state.status, checked: i.state.checked, comment: i.state.comment,
    }})),
  }};
  download("medijob-tests-" + (state.session.date || "export") + ".json", JSON.stringify(payload, null, 2), "application/json");
}}
function exportCsv() {{
  const rows = [["section","id","text","status","comment","deferred"]];
  allItemsFlat().forEach((i) => {{
    rows.push([i.section, i.id, i.text, i.state.status, i.state.comment || "", i.deferred ? "yes" : "no"]
      .map((c) => '"' + String(c).replaceAll('"','""') + '"'));
  }});
  download("medijob-tests-" + (state.session.date || "export") + ".csv", rows.map((r) => r.join(",")).join("\\n"), "text/csv");
}}
function exportBugsMd() {{
  const s = state.session;
  const kos = allItemsFlat().filter((i) => i.state.status === "ko");
  const comments = allItemsFlat().filter((i) => (i.state.comment || "").trim() && i.state.status !== "ko");
  let md = `# Rapport tests MediJob V1.2\\n\\n- Date: ${{s.date||""}}\\n- Testeur: ${{s.tester||""}}\\n- URL: ${{s.url||""}}\\n- Seed: ${{s.seed||""}}\\n- Verdict: ${{s.verdict||""}}\\n\\n`;
  if (s.notes) md += `## Notes\\n\\n${{s.notes}}\\n\\n`;
  md += `## Bugs (KO) — ${{kos.length}}\\n\\n`;
  kos.forEach((i, idx) => {{ md += `### B${{idx+1}} — ${{i.text}}\\n\\n- Section: ${{i.section}}\\n- ${{i.state.comment || "_vide_"}}\\n\\n`; }});
  md += `## Autres commentaires — ${{comments.length}}\\n\\n`;
  comments.forEach((i) => {{ md += `- **[${{i.state.status}}]** ${{i.section}} — ${{i.text}}\\n  - ${{i.state.comment}}\\n`; }});
  download("medijob-bugs-" + (s.date || "export") + ".md", md, "text/markdown");
}}
document.getElementById("btn-export-json").onclick = exportJson;
document.getElementById("btn-export-csv").onclick = exportCsv;
document.getElementById("btn-export-bugs").onclick = exportBugsMd;
document.getElementById("btn-expand").onclick = () => document.querySelectorAll("details.block").forEach((d) => d.open = true);
document.getElementById("btn-collapse").onclick = () => document.querySelectorAll("details.block").forEach((d) => d.open = false);
document.getElementById("btn-restore").onclick = () => {{
  if (confirm("Recharger le snapshot du 03/08 (59 OK + 24 KO) ?")) {{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clonePrefill()));
    location.reload();
  }}
}};
document.getElementById("btn-reset").onclick = () => {{
  if (confirm("Tout remettre à À faire (perd la progression) ?")) {{
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({{ session: {{}}, items: {{}}, updatedAt: null }}));
    location.reload();
  }}
}};
document.getElementById("import-json").addEventListener("change", async (e) => {{
  const file = e.target.files[0]; if (!file) return;
  const payload = JSON.parse(await file.text());
  state.session = payload.session || {{}};
  state.items = {{}};
  (payload.items || []).forEach((it) => {{
    state.items[it.id] = {{ checked: !!it.checked, status: it.status || "todo", comment: it.comment || "" }};
  }});
  saveState(); location.reload();
}});
["filter-todo","filter-comments","search"].forEach((id) => {{
  document.getElementById(id).addEventListener("input", applyFilters);
  document.getElementById(id).addEventListener("change", applyFilters);
}});
renderAccounts(); renderKnown(); bindSession(); renderSections(); updateStats(); renderBugs(); updateToc(); applyFilters(); saveState();
</script>
</body>
</html>
"""


def main() -> None:
    OUT.write_text(build_html(normalize_sections()), encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
