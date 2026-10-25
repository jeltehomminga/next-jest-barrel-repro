#!/usr/bin/env bash
# Copies one test file N times and times the whole run, like a real suite where
# every test file gets its own module registry and loads the barrel again.
# Usage: scripts/bench.sh <barrel|direct> [N] [extra env, e.g. MUI_MODULARIZE=1]
set -euo pipefail
kind=$1; n=${2:-50}; extra=${3:-}
dir="__tests__/generated"
command rm -rf "$dir"; mkdir -p "$dir"
for i in $(seq 1 "$n"); do sed 's#"\./#"../#' "__tests__/$kind.test.tsx" > "$dir/$kind-$i.test.tsx"; done
start=$(node -p 'Date.now()')
env $extra node node_modules/jest/bin/jest.js --no-cache ${JEST_ARGS:-} "$dir" > /dev/null 2>&1
end=$(node -p 'Date.now()')
command rm -rf "$dir"
echo "$kind x$n ${extra:-} $(( end - start )) ms"
