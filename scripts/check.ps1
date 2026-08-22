$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot

Push-Location $projectRoot
try {
    & "backend/.venv/Scripts/python.exe" "backend/manage.py" check
    & "backend/.venv/Scripts/python.exe" -m pytest -q
    Push-Location "frontend"
    try {
        & npm.cmd run lint
        & npm.cmd run typecheck
        & npm.cmd run build
    }
    finally { Pop-Location }
}
finally { Pop-Location }
