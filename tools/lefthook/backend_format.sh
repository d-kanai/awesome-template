#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 0 ]; then
  exit 0
fi

backend_files=()
for path in "$@"; do
  if [[ "$path" == backend/* ]]; then
    trimmed=${path#backend/}
    full_path="backend/$trimmed"
    if [[ "$trimmed" == src/*/java/* ]] && [[ "$trimmed" == *.java ]] && [ -f "$full_path" ]; then
      backend_files+=("$trimmed")
    fi
  fi
done

if [ "${#backend_files[@]}" -eq 0 ]; then
  exit 0
fi

old_ifs=$IFS
IFS=':'
files_joined="${backend_files[*]}"
IFS=$old_ifs

cd backend
./gradlew spotlessApply -PspotlessFiles="$files_joined"
