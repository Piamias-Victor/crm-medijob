# Env Vercel — hybrid (Next sur Vercel, DB/S3 sur AWS)
# Project Root Directory = `apps/web` (monorepo).
# Ne JAMAIS committer les valeurs.

## Obligatoire
DATABASE_URL              # `tofu -chdir=infra output -raw database_url`
AUTH_SECRET               # openssl rand -base64 32
NEXTAUTH_SECRET           # = AUTH_SECRET
NEXTAUTH_URL              # https://<projet>.vercel.app (ou domaine custom)
S3_DOCUMENTS_BUCKET       # `tofu -chdir=infra output -raw documents_bucket`
S3_DOCUMENTS_REGION       # eu-west-3
AWS_ACCESS_KEY_ID         # `tofu -chdir=infra output -raw vercel_aws_access_key_id`
AWS_SECRET_ACCESS_KEY     # `tofu -chdir=infra output -raw vercel_aws_secret_access_key`
CRON_ENABLED=false        # go-live sans mail/SMS

## OK métier (lecture / IA)
EXTRACTION_PROVIDER / OPENROUTER_API_KEY / EXTRACTION_MODEL
BADAKAN_EMAIL / BADAKAN_PASSWORD / BADAKAN_API_URL
JOBS_*

## INTERDIT pour l’instant
RESEND_API_KEY / BREVO_* / HIREFLIX_* / AVAILABILITY_LINK_TEST_PHONE
AUTH_DEV_AUTO_LOGIN
BLOB_READ_WRITE_TOKEN     # inutile si S3_DOCUMENTS_BUCKET set

## Check
1. Deploy Vercel Production
2. Ouvrir `/login` → admin Victor
3. Upload doc candidat → objet dans le bucket S3
