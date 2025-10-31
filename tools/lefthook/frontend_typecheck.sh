#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 0 ]; then
  exit 0
fi

should_run=false
for path in "$@"; do
  if [[ "$path" == frontend_native/* ]]; then
    trimmed=${path#frontend_native/}
    case "$trimmed" in
      *.ts|*.tsx|*.js|*.jsx|*.json|*.cjs|*.mjs)
        if [ -f "frontend_native/$trimmed" ]; then
          should_run=true
          break
        fi
        ;;
    esac
  fi
done

if ! $should_run; then
  exit 0
fi

pnpm --dir frontend_native run typecheck
