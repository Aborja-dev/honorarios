#!/bin/sh
# Corre automáticamente al arrancar el contenedor (mecanismo propio de la
# imagen de nginx: todo script ejecutable en /docker-entrypoint.d/ se corre
# antes de iniciar nginx). Escribe env-config.js con las variables de
# entorno reales de este despliegue — llegan aquí porque Auto Deploy las
# inyecta al pod a partir de las variables de CI/CD K8S_SECRET_<NOMBRE>.
#
# Misma lista que scripts/generate-env-config.mjs y src/app/core/env.ts.
set -e

cat <<EOF > /usr/share/nginx/html/env-config.js
window.__ENV__ = {
  BACKEND_URI: "${BACKEND_URI:-}",
  SECRET_KEY: "${SECRET_KEY:-}",
  IDP_PLUGIN: "${IDP_PLUGIN:-}",
  IDP_CLIENT_ID: "${IDP_CLIENT_ID:-}",
  IDP_SECRET_KEY: "${IDP_SECRET_KEY:-}",
  IDP_DATA_URI: "${IDP_DATA_URI:-}",
  AMBIENTE: "${AMBIENTE:-}"
};
EOF
