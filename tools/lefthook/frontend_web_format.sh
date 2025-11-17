#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 0 ]; then
  exit 0
fi

web_files=()
for path in "$@"; do
  if [[ "$path" == frontend_web/* ]]; then
    trimmed=${path#frontend_web/}
    full_path="frontend_web/$trimmed"
    # Skip figma_generated files
    if [[ "$trimmed" == features/shared/figma_generated/* ]]; then
      continue
    fi
    case "$trimmed" in
      *.ts|*.tsx|*.js|*.jsx|*.json|*.cjs|*.mjs)
        if [ -f "$full_path" ]; then
          web_files+=("$trimmed")
        fi
        ;;
    esac
  fi
done

if [ "${#web_files[@]}" -eq 0 ]; then
  exit 0
fi

pnpm --dir frontend_web exec biome format --write "${web_files[@]}"
