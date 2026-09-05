# Terraform — AWS prod bootstrap (eu-west-3 Paris)
#
# Tes clés restent chez toi. Choisis le bon compte puis apply :
#
#   export AWS_PROFILE=medijob-prod    # le profil du BON compte AWS
#   aws sts get-caller-identity        # vérifier Account / Arn
#   cd infra
#   cp terraform.tfvars.example terraform.tfvars   # éditer
#   terraform init
#   terraform plan
#   terraform apply
#
# Ensuite (DB vide → schéma + ton user) :
#   export DATABASE_URL="$(terraform output -raw database_url)"
#   cd ../apps/web
#   pnpm exec prisma migrate deploy
#   ADMIN_EMAIL=… ADMIN_PASSWORD=… ADMIN_NAME=… pnpm db:create-admin
#
# Stockage docs (app) :
#   S3_DOCUMENTS_BUCKET="$(tofu output -raw documents_bucket)"
#   S3_DOCUMENTS_REGION=eu-west-3
#
# Hybrid (recommandé) — Next sur Vercel, DB/S3 AWS :
#   tofu apply   # IAM user vercel + clés S3
#   Voir VERCEL_ENV.md
#   Vercel → Settings → Root Directory = apps/web → coller les env
#
# Amplify (abandonné pour SSR — limite 220 Mo) :
#   Voir AMPLIFY_ENV.md / leave branch auto-build off
