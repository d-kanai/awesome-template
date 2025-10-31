#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 0 ]; then
  exit 0
fi

native_files=()
for path in "$@"; do
  if [[ "$path" == frontend_native/* ]]; then
    trimmed=${path#frontend_native/}
    full_path="frontend_native/$trimmed"
    case "$trimmed" in
      *.ts|*.tsx|*.js|*.jsx|*.json|*.cjs|*.mjs)
        if [ -f "$full_path" ]; then
          native_files+=("$trimmed")
        fi
        ;;
    esac
  fi
done

if [ "${#native_files[@]}" -eq 0 ]; then
  exit 0
fi

pnpm --dir frontend_native exec biome format --write "${native_files[@]}"
