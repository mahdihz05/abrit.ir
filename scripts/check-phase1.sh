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

git status --porcelain=v1 -z > "$run_dir/repo-status-before.z"

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
    if "$python_path" -c "import corsheaders, django, django_ratelimit, drf_spectacular, jsonschema, PIL, pytest, pytest_django, rest_framework, whitenoise, yaml; print(django.get_version())"; then
        echo "PASS: pinned backend imports"
        run_check "Pinned backend dependency consistency" "$python_path" -m pip check
        run_check "Django checks" "$python_path" "$repo_root/backend/manage.py" check
        run_check "Disposable migrations" "$python_path" "$repo_root/backend/manage.py" migrate --noinput
        run_check "Migration drift" "$python_path" "$repo_root/backend/manage.py" makemigrations --check --dry-run
        run_check "Backend tests" "$python_path" -m pytest -q --basetemp="$run_dir/pytest-tmp" -o "cache_dir=$run_dir/pytest-cache"
        run_check "OpenAPI validation" "$python_path" "$repo_root/backend/manage.py" spectacular --file "$run_dir/schema/schema.yml" --validate
    else
        echo "BLOCKED: the documented POSIX environment is incomplete; pinned backend imports failed."
        blocked=1
    fi
else
    echo "BLOCKED: supported interpreter is absent: $python_path"
    blocked=1
fi

frontend_build_root="$run_dir/frontend-build"
frontend_copy="$frontend_build_root/source"
reference_homepage="$repo_root/abrit-homepage-polished-v5.html"
reference_copy="$frontend_build_root/abrit-homepage-polished-v5.html"

if [[ -f $reference_homepage ]]; then
    cp -- "$reference_homepage" "$reference_copy"
    chmod a-w -- "$reference_copy"
    if cmp -s -- "$reference_homepage" "$reference_copy"; then
        echo "PASS: disposable frontend parent-relative input is present and byte-identical."
    else
        echo "FAIL: disposable frontend parent-relative input does not match the repository source." >&2
        failed=1
    fi
else
    echo "FAIL: required frontend parent-relative input is absent: $reference_homepage" >&2
    failed=1
fi

frontend_modules="$repo_root/frontend/node_modules"
primary_frontend="$repo_root/../abrit.ir/frontend"
if [[ ! -x $frontend_modules/.bin/next || ! -x $frontend_modules/.bin/eslint ]]; then
    primary_modules="$primary_frontend/node_modules"
    if [[ -x $primary_modules/.bin/next && -x $primary_modules/.bin/eslint ]] \
        && cmp -s -- "$repo_root/frontend/package-lock.json" "$primary_frontend/package-lock.json" \
        && node -e 'const fs=require("fs"); const a=JSON.parse(fs.readFileSync(process.argv[1])); const b=JSON.parse(fs.readFileSync(process.argv[2])); process.exit(JSON.stringify(a)===JSON.stringify(b)?0:1)' \
            "$repo_root/frontend/package.json" "$primary_frontend/package.json"; then
        frontend_modules="$primary_modules"
        echo "PASS: reusing the primary reference worktree's lock-compatible frontend dependencies read-only."
    fi
fi

if [[ -x $frontend_modules/.bin/next && -x $frontend_modules/.bin/eslint ]]; then
    mkdir -p -- "$frontend_copy"
    tar -C "$repo_root/frontend" \
        --exclude='./node_modules' \
        --exclude='./.next' \
        --exclude='./out' \
        --exclude='./tmp' \
        -cf - . | tar -C "$frontend_copy" -xf -
    disposable_modules="$frontend_build_root/node_modules"
    echo "RUN: Copy frontend dependencies into the disposable root"
    if cp -a --reflink=auto -- "$frontend_modules" "$disposable_modules"; then
        echo "PASS: frontend dependencies copied below the disposable root."
        ln -s -- "$disposable_modules" "$frontend_copy/node_modules"
        run_check "Frontend dependency tree" npm --prefix "$frontend_copy" ls --depth=0
        run_check "Frontend lint" npm --prefix "$frontend_copy" run lint
        if (cd -- "$frontend_copy" && node -e 'for (const name of ["@next/swc-linux-x64-gnu", "@next/swc-linux-x64-musl", "@next/swc-wasm-nodejs", "@next/swc-wasm-web"]) { try { require.resolve(name); process.exit(0); } catch {} } process.exit(1)'); then
            run_check "Frontend typecheck" npm --prefix "$frontend_copy" run typecheck
            run_check "Frontend build" npm --prefix "$frontend_copy" run build
        else
            echo "BLOCKED: the existing frontend dependency tree has no Linux-compatible Next SWC runtime; typecheck and build were not run."
            blocked=1
        fi
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
        echo "FAIL: could not copy frontend dependencies into the disposable root." >&2
        failed=1
    fi
else
    echo "BLOCKED: no lock-compatible existing frontend dependency tree is available."
    blocked=1
fi

snapshot_protected protected-after.sha256
if cmp -s "$run_dir/protected-before.sha256" "$run_dir/protected-after.sha256"; then
    echo "PASS: protected repository data is unchanged."
else
    echo "FAIL: protected repository data changed during verification." >&2
    failed=1
fi

git status --porcelain=v1 -z > "$run_dir/repo-status-after.z"
if cmp -s "$run_dir/repo-status-before.z" "$run_dir/repo-status-after.z"; then
    echo "PASS: repository worktree state is unchanged by verification."
else
    echo "FAIL: repository worktree state changed during verification." >&2
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
