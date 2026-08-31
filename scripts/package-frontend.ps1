$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$frontendRoot = Join-Path $projectRoot "frontend"
$standaloneRoot = Join-Path $frontendRoot ".next/standalone"
$standaloneFrontend = Join-Path $standaloneRoot "frontend"
$artifactsRoot = Join-Path $projectRoot "artifacts"
$archivePath = Join-Path $artifactsRoot "abrit-frontend-standalone.tar.gz"

$env:NEXT_PUBLIC_SITE_URL = "https://abrit.cloud"
if (-not $env:DATABASE_URI) { throw "DATABASE_URI must point to the production PostgreSQL database." }
if (-not $env:PAYLOAD_SECRET) { throw "PAYLOAD_SECRET is required." }

$resolvedFrontendRoot = (Resolve-Path -LiteralPath $frontendRoot).Path
$resolvedStandaloneRoot = [System.IO.Path]::GetFullPath($standaloneRoot)
if (-not $resolvedStandaloneRoot.StartsWith("$resolvedFrontendRoot\", [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to clean a standalone path outside the frontend directory."
}
if (Test-Path -LiteralPath $resolvedStandaloneRoot) {
    Remove-Item -Recurse -Force -LiteralPath $resolvedStandaloneRoot
}

Push-Location $frontendRoot
try {
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw "Next.js production build failed." }
}
finally {
    Pop-Location
}

Copy-Item -Recurse -Force (Join-Path $frontendRoot "public") (Join-Path $standaloneFrontend "public")
Copy-Item -Recurse -Force (Join-Path $frontendRoot ".next/static") (Join-Path $standaloneFrontend ".next/static")
Copy-Item -Force (Join-Path $PSScriptRoot "cpanel-standalone-server.js") (Join-Path $standaloneRoot "server.js")
Copy-Item -Force (Join-Path $PSScriptRoot "cpanel-standalone-package.json") (Join-Path $standaloneRoot "package.json")

New-Item -ItemType Directory -Force $artifactsRoot | Out-Null
if (Test-Path -LiteralPath $archivePath) { Remove-Item -LiteralPath $archivePath }
& tar.exe -czf $archivePath -C $standaloneRoot .
if ($LASTEXITCODE -ne 0) { throw "Creating the standalone archive failed." }

Write-Output $archivePath
