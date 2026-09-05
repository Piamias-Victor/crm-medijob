#!/usr/bin/env bash
# Hybrid: create/link Vercel project for apps/web + print AWS env helpers.
# Needs: VERCEL_TOKEN (Account → Settings → Tokens) — NOT a KMS issuer id.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/apps/web"

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "Set VERCEL_TOKEN first: https://vercel.com/account/tokens"
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Installing vercel CLI locally..."
  npx --yes vercel@latest --version
  VERCEL=(npx --yes vercel@latest)
else
  VERCEL=(vercel)
fi

"${VERCEL[@]}" link --yes --token "$VERCEL_TOKEN" --project medijob-prod || \
  "${VERCEL[@]}" project add medijob-prod --token "$VERCEL_TOKEN"

echo "Linked. Next: set env from infra/VERCEL_ENV.md then:"
echo "  ${VERCEL[*]} --prod --token \"\$VERCEL_TOKEN\""
