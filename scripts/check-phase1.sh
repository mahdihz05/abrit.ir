#!/usr/bin/env bash

set -u

usage() {
    echo "Usage: ABRIT_VERIFY_DIR=/tmp/<name> [ABRIT_PYTHON=/path/to/python] scripts/check-phase1.sh --baseline|--all" >&2
}

mode=${1:-}
if [[ $mode != "--baseline" && $mode != "--all" || $# -ne 1 ]]; then
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

repo_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
cd -- "$repo_root"

if [[ -v ABRIT_PYTHON ]]; then
    if [[ -z ${ABRIT_PYTHON:-} || ! -f $ABRIT_PYTHON || ! -x $ABRIT_PYTHON ]]; then
        echo "REFUSED: ABRIT_PYTHON must name an existing executable file: ${ABRIT_PYTHON:-<empty>}" >&2
        exit 64
    fi
    # Keep the venv launcher path intact; resolving it can discard the venv's
    # adjacent site-packages when the launcher is a symlink.
    python_path="$ABRIT_PYTHON"
    echo "PYTHON_SOURCE=ABRIT_PYTHON"
else
    python_path="$repo_root/.runtime/phase1-venv/bin/python"
    echo "PYTHON_SOURCE=documented default"
fi

mkdir -p -- "$verify_root"
run_dir=$(mktemp -d "$verify_root/run.XXXXXXXX")

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

host_npm_cache=$(npm config get cache 2>/dev/null || true)
export DJANGO_DATABASE_PATH="$run_dir/backend/abrit.sqlite3"
export DJANGO_PUBLIC_MEDIA_ROOT="$run_dir/backend/media"
export DJANGO_PRIVATE_MEDIA_ROOT="$run_dir/backend/private-media"
export DJANGO_SETTINGS_MODULE="config.settings.test"
export NEXT_TELEMETRY_DISABLED=1
export PYTHONDONTWRITEBYTECODE=1
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
backend_ready=0

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
        return "$status"
    fi
}

if [[ -x $python_path ]]; then
    run_check "Python version" "$python_path" --version
    if "$python_path" -c "import corsheaders, django, django_ratelimit, drf_spectacular, jsonschema, PIL, pytest, pytest_django, rest_framework, whitenoise, yaml; print(django.get_version())"; then
        echo "PASS: pinned backend imports"
        backend_ready=1
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
dependency_source=""
frontend_run() {
    if [[ $mode == "--all" ]]; then
        timeout "${ABRIT_FRONTEND_TIMEOUT:-90}s" "$@"
    else
        "$@"
    fi
}
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
    dependency_source="$frontend_modules"
fi

if [[ -f $repo_root/frontend/package.json && -f $repo_root/frontend/package-lock.json ]]; then
    mkdir -p -- "$frontend_copy"
    tar -C "$repo_root/frontend" \
        --exclude='./node_modules' \
        --exclude='./.next' \
        --exclude='./out' \
        --exclude='./tmp' \
        -cf - . | tar -C "$frontend_copy" -xf -
    disposable_modules="$frontend_copy/node_modules"
    npm_install_succeeded=0
    frontend_space_available_mb=$(df -Pm -- "$run_dir" | awk 'NR == 2 {print $4}')
    frontend_min_free_mb=${ABRIT_FRONTEND_MIN_FREE_MB:-2048}
    npm_cache_for_install="$host_npm_cache"
    if [[ -z $npm_cache_for_install || ! -d $npm_cache_for_install || $npm_cache_for_install == "$run_dir"/* ]]; then
        npm_cache_for_install="$run_dir/npm-cache"
    fi
    cache_size_mb=$(du -sm -- "$npm_cache_for_install" 2>/dev/null | awk '{print $1}')
    if [[ ${frontend_space_available_mb:-0} -lt $frontend_min_free_mb ]]; then
        echo "BLOCKED: frontend disposable verification needs at least ${frontend_min_free_mb} MiB free below the bounded run filesystem; available ${frontend_space_available_mb:-unknown} MiB."
        blocked=1
    elif [[ ${cache_size_mb:-0} -le ${ABRIT_NPM_CACHE_MAX_MB:-2048} ]]; then
        echo "RUN: Lockfile frontend dependency install (offline)"
        if frontend_run npm --prefix "$frontend_copy" ci --offline --cache "$npm_cache_for_install"; then
            echo "PASS: Lockfile frontend dependency install (offline)"
            npm_install_succeeded=1
        else
            install_status=$?
            echo "NOT_USED($install_status): offline npm install did not complete; trying the validated cached tree."
        fi
    else
        echo "BLOCKED: npm cache exceeds ABRIT_NPM_CACHE_MAX_MB=${ABRIT_NPM_CACHE_MAX_MB:-2048} MiB."
        blocked=1
    fi
    if (( npm_install_succeeded == 0 && frontend_space_available_mb >= frontend_min_free_mb )); then
        echo "RUN: Materialize the lock-compatible reference dependency tree below the disposable root"
        rm -rf -- "$disposable_modules"
        if [[ -n $dependency_source && -d $dependency_source ]] \
            && cp -aL -- "$dependency_source" "$disposable_modules" \
            && [[ ! -L $disposable_modules ]] \
            && [[ $(realpath -e -- "$disposable_modules") == "$run_dir"/* ]]; then
            echo "PASS: frontend dependency tree materialized below disposable root with no symlinks."
        else
            echo "FAIL: could not materialize a bounded frontend dependency tree below the disposable root." >&2
            failed=1
        fi
    fi
    if [[ -d $disposable_modules && ! -L $disposable_modules ]]; then
        run_check "Frontend dependency tree" frontend_run npm --prefix "$frontend_copy" ls --depth=0
        run_check "Frontend lint" frontend_run npm --prefix "$frontend_copy" run lint
        if (cd -- "$frontend_copy" && node -e 'for (const name of ["@next/swc-linux-x64-gnu", "@next/swc-linux-x64-musl", "@next/swc-wasm-nodejs", "@next/swc-wasm-web"]) { try { require.resolve(name); process.exit(0); } catch {} } process.exit(1)'); then
            run_check "Frontend typecheck" frontend_run npm --prefix "$frontend_copy" run typecheck
            run_check "Frontend build" frontend_run npm --prefix "$frontend_copy" run build
        else
            echo "BLOCKED: the existing frontend dependency tree has no Linux-compatible Next SWC runtime; typecheck and build were not run."
            blocked=1
        fi
        if npm --prefix "$frontend_copy" run | grep -q '^  test$'; then
            run_check "Frontend unit tests" frontend_run npm --prefix "$frontend_copy" run test
        else
            echo "NOT_RUN: frontend test script is not defined; R01 owns the test foundation."
        fi
        if npm --prefix "$frontend_copy" run | grep -q '^  test:e2e$'; then
            run_check "Frontend E2E" frontend_run npm --prefix "$frontend_copy" run test:e2e
        else
            echo "NOT_RUN: frontend test:e2e script is not defined; R01 owns the test foundation."
        fi
    fi
    else
        echo "BLOCKED: no lock-compatible existing frontend dependency tree is available."
        blocked=1
fi

if [[ $mode == "--all" ]]; then
    if (( backend_ready == 0 )); then
        echo "NOT_RUN: --all backend integration checks require the pinned backend imports."
    else
    upgrade_database="$run_dir/migrations/upgrade.sqlite3"
    export DJANGO_DATABASE_PATH="$upgrade_database"
    run_check "Clean migration" "$python_path" "$repo_root/backend/manage.py" migrate --noinput
    run_check "Upgrade migration" "$python_path" "$repo_root/backend/manage.py" migrate --noinput
    run_check "Deterministic Phase 1 role setup" "$python_path" "$repo_root/backend/manage.py" sync_phase1_roles
    run_check "Deterministic verification users" "$python_path" "$repo_root/backend/manage.py" shell -c "from django.contrib.auth.models import User; from apps.accounts.roles import assign_fixed_role; users=[('r18-superuser',None,True),('r18-editor','editor',False),('r18-publisher','publisher',False),('r18-submission-reviewer','submission-reviewer',False),('r18-auditor','auditor',False)]; [(lambda user: (assign_fixed_role(user, r) if r else None))(User.objects.create_superuser(u, password='R18-correct-password') if su else User.objects.create_user(u, password='R18-correct-password')) for u,r,su in users if not User.objects.filter(username=u).exists()]"
    run_check "Same-origin /cms topology" env DJANGO_SCRIPT_NAME=/cms "$python_path" "$repo_root/backend/manage.py" shell -c "from django.test import Client; c=Client(); assert c.get('/health/').status_code == 200; assert c.get('/api/v1/admin/roles').status_code == 401"
    run_check "Public API regression" "$python_path" "$repo_root/backend/manage.py" shell -c "from django.test import Client; c=Client(); assert c.get('/health/').status_code == 200; assert c.get('/api/v1/navigation/header/en').status_code == 200; assert c.get('/api/v1/content/collections/page/en').status_code == 200; assert c.get('/api/v1/pricing/packages?locale=en').status_code == 200; assert c.get('/api/v1/search?locale=en&q=ab').status_code == 200"
    export DJANGO_DATABASE_PATH="$run_dir/backend/abrit.sqlite3"
    expected_roots=("$run_dir/backend/media" "$run_dir/backend/private-media" "$run_dir/cache" "$run_dir/e2e" "$run_dir/migrations" "$run_dir/pytest-cache" "$run_dir/pytest-tmp" "$run_dir/schema" "$run_dir/tmp")
    for artifact_root in "${expected_roots[@]}"; do
        if [[ -d $artifact_root && $(realpath -m -- "$artifact_root") == "$run_dir"/* ]]; then
            echo "PASS: disposable artifact root is contained: $artifact_root"
        else
            echo "FAIL: disposable artifact root is missing or escapes run root: $artifact_root" >&2
            failed=1
        fi
    done
    fi
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
