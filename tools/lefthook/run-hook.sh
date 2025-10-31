#!/bin/sh

set -eu

if [ "${LEFTHOOK_VERBOSE:-0}" = "1" ] || [ "${LEFTHOOK_VERBOSE:-}" = "true" ]; then
  set -x
fi

if [ "${LEFTHOOK:-1}" = "0" ]; then
  exit 0
fi

hook_name="${LEFTHOOK_HOOK:-$(basename "$0")}"
dir="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
lefthook_bin="${LEFTHOOK_BIN:-"$dir/tools/lefthook/lefthook"}"
lefthook_config="${LEFTHOOK_CONFIG:-"$dir/tools/lefthook/lefthook.yml"}"

if [ ! -x "$lefthook_bin" ]; then
  echo "lefthook binary not found at $lefthook_bin"
  echo "Please run make lefthook-install to set up hooks."
  exit 1
fi

LEFTHOOK_CONFIG="$lefthook_config" "$lefthook_bin" run "$hook_name" "$@"
