#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 0 ]; then
  exit 0
fi

has_web_files=false
for path in "$@"; do
  if [[ "$path" == frontend_web/* ]]; then
    has_web_files=true
    break
  fi
done

if [ "$has_web_files" = false ]; then
  exit 0
fi

pnpm --dir frontend_web typecheck
