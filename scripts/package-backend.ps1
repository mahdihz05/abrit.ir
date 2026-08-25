$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$backendRoot = Join-Path $projectRoot "backend"
$artifactsRoot = Join-Path $projectRoot "artifacts"
$packageRoot = Join-Path $artifactsRoot "abrit-backend-package"
$archivePath = Join-Path $artifactsRoot "abrit-backend.tar.gz"

$resolvedProjectRoot = (Resolve-Path -LiteralPath $projectRoot).Path
$resolvedPackageRoot = [System.IO.Path]::GetFullPath($packageRoot)
if (-not $resolvedPackageRoot.StartsWith("$resolvedProjectRoot\artifacts\", [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to clean a backend package path outside the artifacts directory."
}

New-Item -ItemType Directory -Force $artifactsRoot | Out-Null
if (Test-Path -LiteralPath $resolvedPackageRoot) {
    Remove-Item -Recurse -Force -LiteralPath $resolvedPackageRoot
}
New-Item -ItemType Directory -Force $resolvedPackageRoot | Out-Null

Copy-Item -Recurse -Force (Join-Path $backendRoot "apps") (Join-Path $resolvedPackageRoot "apps")
Copy-Item -Recurse -Force (Join-Path $backendRoot "config") (Join-Path $resolvedPackageRoot "config")
Copy-Item -Force (Join-Path $backendRoot "manage.py") $resolvedPackageRoot
Copy-Item -Force (Join-Path $backendRoot "passenger_wsgi.py") $resolvedPackageRoot
Copy-Item -Force (Join-Path $backendRoot "schema.yml") $resolvedPackageRoot
Copy-Item -Force (Join-Path $projectRoot "requirements.txt") $resolvedPackageRoot
Copy-Item -Force (Join-Path $projectRoot ".env.example") $resolvedPackageRoot

Get-ChildItem -Path $resolvedPackageRoot -Directory -Recurse -Filter "__pycache__" |
    Remove-Item -Recurse -Force
Get-ChildItem -Path $resolvedPackageRoot -File -Recurse -Include "*.pyc", "*.pyo" |
    Remove-Item -Force

if (Test-Path -LiteralPath $archivePath) {
    Remove-Item -Force -LiteralPath $archivePath
}
& tar.exe -czf $archivePath -C $resolvedPackageRoot .
if ($LASTEXITCODE -ne 0) { throw "Creating the backend archive failed." }

Remove-Item -Recurse -Force -LiteralPath $resolvedPackageRoot
Write-Output $archivePath
