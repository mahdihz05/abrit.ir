$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$frontendRoot = Join-Path $projectRoot "frontend"
$standaloneRoot = Join-Path $frontendRoot ".next/standalone"
$standaloneFrontend = Join-Path $standaloneRoot "frontend"
$artifactsRoot = Join-Path $projectRoot "artifacts"
$archivePath = Join-Path $artifactsRoot "abrit-frontend-standalone.zip"

$env:NEXT_PUBLIC_SITE_URL = "https://abrit.cloud"
$env:NEXT_PUBLIC_API_URL = "https://abrit.cloud/cms/api/v1"
$env:BACKEND_API_URL = "https://abrit.cloud/cms/api/v1"

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
Copy-Item -Force (Join-Path $projectRoot "abrit-homepage-polished-v5.html") $standaloneRoot

New-Item -ItemType Directory -Force $artifactsRoot | Out-Null
if (Test-Path -LiteralPath $archivePath) { Remove-Item -LiteralPath $archivePath }
Compress-Archive -Path (Join-Path $standaloneRoot "*") -DestinationPath $archivePath -CompressionLevel Optimal

Write-Output $archivePath
