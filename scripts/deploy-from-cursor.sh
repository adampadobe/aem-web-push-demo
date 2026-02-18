#!/usr/bin/env bash
# Deploy from Cursor: push code to GitHub, then trigger EDS preview + publish via Admin API.
# No Sidekick required. Content must already exist in Google Drive (preview/publish once there first).
set -e

ORG="adampadobe"
SITE="aem-web-push-demo"
REF="main"
ADMIN_BASE="https://admin.hlx.page"

# Optional: set AEM_AUTH_TOKEN if your org requires auth for Admin API
CURL_AUTH=()
if [ -n "$AEM_AUTH_TOKEN" ]; then
  CURL_AUTH=(-H "x-auth-token: $AEM_AUTH_TOKEN")
fi

echo "==> Pushing code to GitHub..."
git push origin "$REF"

echo ""
echo "==> Triggering preview (pull content from Drive into preview)..."
HTTP_CODE=$(curl -s -o /tmp/deploy-preview.json -w "%{http_code}" -X POST \
  "${ADMIN_BASE}/preview/${ORG}/${SITE}/${REF}/*" \
  -H "Content-Type: application/json" \
  "${CURL_AUTH[@]}" \
  -d '{"paths": ["/", "/push-demo"], "forceUpdate": true}')
if [ "$HTTP_CODE" = "202" ] || [ "$HTTP_CODE" = "200" ]; then
  echo "    Preview job started (HTTP $HTTP_CODE)."
else
  echo "    Preview response: HTTP $HTTP_CODE"
  cat /tmp/deploy-preview.json 2>/dev/null | head -5
  if [ "$HTTP_CODE" = "401" ]; then
    echo "    Tip: If your org requires auth, set AEM_AUTH_TOKEN and run again."
  fi
fi

echo ""
echo "==> Triggering publish (preview -> live)..."
HTTP_CODE2=$(curl -s -o /tmp/deploy-publish.json -w "%{http_code}" -X POST \
  "${ADMIN_BASE}/live/${ORG}/${SITE}/${REF}/*" \
  -H "Content-Type: application/json" \
  "${CURL_AUTH[@]}" \
  -d '{"paths": ["/", "/push-demo"], "forceUpdate": true}')
if [ "$HTTP_CODE2" = "202" ] || [ "$HTTP_CODE2" = "200" ]; then
  echo "    Publish job started (HTTP $HTTP_CODE2)."
else
  echo "    Publish response: HTTP $HTTP_CODE2"
  cat /tmp/deploy-publish.json 2>/dev/null | head -5
  if [ "$HTTP_CODE2" = "401" ]; then
    echo "    Tip: If your org requires auth, set AEM_AUTH_TOKEN and run again."
  fi
fi

echo ""
echo "==> Done. Code is pushed; preview and publish jobs are running."
echo "    Preview: https://main--${SITE}--${ORG}.aem.page/"
echo "    Live:    https://main--${SITE}--${ORG}.aem.live/"
echo "    (Allow 1–2 minutes for jobs to complete.)"
