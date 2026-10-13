#!/usr/bin/env bash
# Trigger a Dokploy compose deployment via its API.
# Required env: DOKPLOY_URL, DOKPLOY_API_KEY, DOKPLOY_COMPOSE_ID
set -euo pipefail

for v in DOKPLOY_URL DOKPLOY_API_KEY DOKPLOY_COMPOSE_ID; do
  if [ -z "${!v:-}" ]; then
    echo "::error::$v is not configured."
    exit 1
  fi
done

base="${DOKPLOY_URL%/}"
endpoint="$base/api/compose.deploy"

echo "POST $endpoint"

code=$(curl --silent --show-error --location --max-time 30 \
  --output response.body --dump-header response.head --write-out '%{http_code}' \
  --request POST \
  --header "x-api-key: $DOKPLOY_API_KEY" \
  --header "Authorization: Bearer $DOKPLOY_API_KEY" \
  --header "Content-Type: application/json" \
  --data "{\"composeId\":\"$DOKPLOY_COMPOSE_ID\"}" \
  "$endpoint" || true)

echo "HTTP $code"
echo "--- response headers ---"
cat response.head || true
echo "--- response body (first 1500 bytes) ---"
head -c 1500 response.body || true
echo

case "$code" in
  2*)
    echo "::notice::Dokploy deployment triggered (HTTP $code)."
    exit 0
    ;;
  403)
    if grep -qi 'cloudflare\|cf-ray\|just a moment\|attention required' response.head response.body; then
      echo "::error::403 from Cloudflare, not Dokploy. The Dokploy host is proxied and Cloudflare is blocking the GitHub Actions runner. Fix: add a Cloudflare WAF skip rule for POST /api/compose.deploy (or expose the panel on a DNS-only subdomain), then retry."
    else
      echo "::error::403 from Dokploy. The API key is being rejected or lacks permission for this compose app. Regenerate the token in Dokploy > Settings, and confirm DOKPLOY_COMPOSE_ID belongs to the same Dokploy account."
    fi
    exit 1
    ;;
  401)
    echo "::error::401 - DOKPLOY_API_KEY is invalid. Create one in Dokploy > Settings > API/Tokens."
    exit 1
    ;;
  404)
    echo "::error::404 - wrong URL or path. DOKPLOY_URL must be the Dokploy panel base URL (no trailing path); this Dokploy version may use a different endpoint."
    exit 1
    ;;
  *)
    echo "::error::Unexpected HTTP $code from Dokploy."
    exit 1
    ;;
esac
