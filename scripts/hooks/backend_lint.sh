#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 0 ]; then
  exit 0
fi

main_files=()
test_files=()
for path in "$@"; do
  if [[ "$path" == backend/* ]]; then
    trimmed=${path#backend/}
    full_path="backend/$trimmed"
    if [ -f "$full_path" ]; then
      case "$trimmed" in
        src/main/java/*)
          if [[ "$trimmed" == *.java ]]; then
            main_files+=("$trimmed")
          fi
          ;;
        src/test/java/*)
          if [[ "$trimmed" == *.java ]]; then
            test_files+=("$trimmed")
          fi
          ;;
        *)
          ;;
      esac
    fi
  fi
done

if [ "${#main_files[@]}" -eq 0 ] && [ "${#test_files[@]}" -eq 0 ]; then
  exit 0
fi

join_with_pathsep() {
  local old_ifs=$IFS
  IFS=':'
  local joined="$*"
  IFS=$old_ifs
  echo "$joined"
}

props=()
tasks=()

if [ "${#main_files[@]}" -gt 0 ]; then
  tasks+=(checkstyleMain)
  main_joined=$(join_with_pathsep "${main_files[@]}")
  props+=(-PcheckstyleMainFiles="$main_joined")
fi

if [ "${#test_files[@]}" -gt 0 ]; then
  tasks+=(checkstyleTest)
  test_joined=$(join_with_pathsep "${test_files[@]}")
  props+=(-PcheckstyleTestFiles="$test_joined")
fi

cd backend
./gradlew "${props[@]}" "${tasks[@]}"
