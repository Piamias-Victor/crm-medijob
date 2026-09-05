# Env Amplify — checklist (copier dans Console Amplify → Environment variables)
# Secrets = depuis ton .env local. Ne JAMAIS committer les valeurs.

## Obligatoire (app live)
DATABASE_URL          # tofu output -raw database_url
AUTH_SECRET           # openssl rand -base64 32
NEXTAUTH_SECRET       # = AUTH_SECRET
NEXTAUTH_URL          # https://<branch>.<app>.amplifyapp.com  (après 1er deploy)
S3_DOCUMENTS_BUCKET   # déjà posé par Terraform (vérifier)
S3_DOCUMENTS_REGION   # eu-west-3 (déjà posé)
CRON_ENABLED=false    # déjà posé — NE PAS passer à true

## OK métier (pas d’envoi auto si CRON off)
EXTRACTION_PROVIDER / OPENROUTER_API_KEY / EXTRACTION_MODEL
BADAKAN_EMAIL / BADAKAN_PASSWORD / BADAKAN_API_URL
JOBS_* (board lecture)

## INTERDIT pour l’instant (pas mail / SMS)
# Ne PAS setter (ou laisser vide) :
RESEND_API_KEY
BREVO_API_KEY
BREVO_SENDER
BREVO_TEMPLATE_ID
BREVO_SMS_SENDER
HIREFLIX_API_KEY
HIREFLIX_POSITION_ID
HIREFLIX_INVITE_TEST_TO
AVAILABILITY_LINK_TEST_PHONE
CRON_SECRET           # inutile tant que CRON_ENABLED=false
AUTH_DEV_AUTO_LOGIN   # jamais en prod

## Après go-live mail/SMS (plus tard)
# CRON_ENABLED=true + clés Resend/Brevo/Hireflix + EventBridge
