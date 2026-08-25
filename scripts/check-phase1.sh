#!/usr/bin/env bash

set -u

usage() {
    echo "Usage: ABRIT_VERIFY_DIR=/tmp/<name> scripts/check-phase1.sh --baseline" >&2
}

if [[ ${1:-} != "--baseline" || $# -ne 1 ]]; then
    usage
    exit 64
fi

if [[ -z ${ABRIT_VERIFY_DIR:-} ]]; then
    echo "REFUSED: ABRIT_VERIFY_DIR is unset or empty." >&2
    exit 64
fi

verify_root=$(realpath -m -- "$ABRIT_VERIFY_DIR")
case "$verify_root" in
    /tmp/*) ;;
    *)
        echo "REFUSED: verification root must be a child of /tmp: $verify_root" >&2
        exit 64
        ;;
esac

if [[ -L $ABRIT_VERIFY_DIR ]]; then
    echo "REFUSED: verification root must not be a symbolic link." >&2
    exit 64
fi

mkdir -p -- "$verify_root"
run_dir=$(mktemp -d "$verify_root/run.XXXXXXXX")
repo_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
cd -- "$repo_root"

mkdir -p -- \
    "$run_dir/backend/media" \
    "$run_dir/backend/private-media" \
    "$run_dir/cache" \
    "$run_dir/e2e" \
    "$run_dir/frontend-build" \
    "$run_dir/migrations" \
    "$run_dir/npm-cache" \
    "$run_dir/pytest-cache" \
    "$run_dir/pytest-tmp" \
    "$run_dir/python-cache" \
    "$run_dir/schema" \
    "$run_dir/tmp"

export DJANGO_DATABASE_PATH="$run_dir/backend/abrit.sqlite3"
export DJANGO_PUBLIC_MEDIA_ROOT="$run_dir/backend/media"
export DJANGO_PRIVATE_MEDIA_ROOT="$run_dir/backend/private-media"
export DJANGO_SETTINGS_MODULE="config.settings.test"
export NEXT_TELEMETRY_DISABLED=1
export PYTHONPYCACHEPREFIX="$run_dir/python-cache"
export XDG_CACHE_HOME="$run_dir/cache"
export TMPDIR="$run_dir/tmp"
export npm_config_cache="$run_dir/npm-cache"

echo "RUN_DIR=$run_dir"
echo "DJANGO_DATABASE_PATH=$DJANGO_DATABASE_PATH"
echo "DJANGO_PUBLIC_MEDIA_ROOT=$DJANGO_PUBLIC_MEDIA_ROOT"
echo "DJANGO_PRIVATE_MEDIA_ROOT=$DJANGO_PRIVATE_MEDIA_ROOT"
echo "PYTEST_ROOT=$run_dir/pytest-tmp"
echo "CACHE_ROOT=$run_dir/cache"
echo "SCHEMA_ROOT=$run_dir/schema"
echo "FRONTEND_BUILD_ROOT=$run_dir/frontend-build"
echo "E2E_ROOT=$run_dir/e2e"

protected_paths=(
    "backend/data/abrit.sqlite3"
    "backend/schema.yml"
)

snapshot_protected() {
    local output_name=$1
    local path
    : > "$run_dir/$output_name"
    for path in "${protected_paths[@]}"; do
        if [[ -f $repo_root/$path ]]; then
            sha256sum -- "$repo_root/$path" >> "$run_dir/$output_name"
        else
            echo "MISSING  $repo_root/$path" >> "$run_dir/$output_name"
        fi
    done
}

snapshot_protected protected-before.sha256

failed=0
blocked=0

run_check() {
    local label=$1
    shift
    echo "RUN: $label"
    if "$@"; then
        echo "PASS: $label"
    else
        local status=$?
        echo "FAIL($status): $label"
        failed=1
    fi
}

python_path="$repo_root/.runtime/phase1-venv/bin/python"
if [[ -x $python_path ]]; then
    run_check "Python version" "$python_path" --version
    run_check "Pinned backend imports" "$python_path" -c "import django, rest_framework; print(django.get_version())"
    run_check "Django checks" "$python_path" "$repo_root/backend/manage.py" check
    run_check "Disposable migrations" "$python_path" "$repo_root/backend/manage.py" migrate --noinput
    run_check "Migration drift" "$python_path" "$repo_root/backend/manage.py" makemigrations --check --dry-run
    run_check "Backend tests" "$python_path" -m pytest -q --basetemp="$run_dir/pytest-tmp" -o "cache_dir=$run_dir/pytest-cache"
    run_check "OpenAPI validation" "$python_path" "$repo_root/backend/manage.py" spectacular --file "$run_dir/schema/schema.yml" --validate
else
    echo "BLOCKED: supported interpreter is absent: $python_path"
    blocked=1
fi

if [[ -x $repo_root/frontend/node_modules/.bin/next && -x $repo_root/frontend/node_modules/.bin/eslint ]]; then
    frontend_copy="$run_dir/frontend-build/source"
    mkdir -p -- "$frontend_copy"
    tar -C "$repo_root/frontend" \
        --exclude='./node_modules' \
        --exclude='./.next' \
        --exclude='./out' \
        --exclude='./tmp' \
        -cf - . | tar -C "$frontend_copy" -xf -
    ln -s -- "$repo_root/frontend/node_modules" "$frontend_copy/node_modules"
    run_check "Frontend lint" npm --prefix "$frontend_copy" run lint
    run_check "Frontend typecheck" npm --prefix "$frontend_copy" run typecheck
    run_check "Frontend build" npm --prefix "$frontend_copy" run build
    if npm --prefix "$frontend_copy" run | grep -q '^  test$'; then
        run_check "Frontend unit tests" npm --prefix "$frontend_copy" run test
    else
        echo "NOT_RUN: frontend test script is not defined; R01 owns the test foundation."
    fi
    if npm --prefix "$frontend_copy" run | grep -q '^  test:e2e$'; then
        run_check "Frontend E2E" npm --prefix "$frontend_copy" run test:e2e
    else
        echo "NOT_RUN: frontend test:e2e script is not defined; R01 owns the test foundation."
    fi
else
    echo "BLOCKED: frontend dependencies are absent: $repo_root/frontend/node_modules"
    blocked=1
fi

snapshot_protected protected-after.sha256
if cmp -s "$run_dir/protected-before.sha256" "$run_dir/protected-after.sha256"; then
    echo "PASS: protected repository data is unchanged."
else
    echo "FAIL: protected repository data changed during verification." >&2
    failed=1
fi

find "$run_dir" -xdev -printf '%P\n' | LC_ALL=C sort > "$run_dir/artifact-manifest.txt"
echo "ARTIFACT_MANIFEST=$run_dir/artifact-manifest.txt"

if (( failed != 0 )); then
    exit 1
fi
if (( blocked != 0 )); then
    exit 2
fi
exit 0
