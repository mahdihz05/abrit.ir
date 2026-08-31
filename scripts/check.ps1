$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$frontendRoot = Join-Path $projectRoot "frontend"

if (-not $env:DATABASE_URI) { $env:DATABASE_URI = "postgresql://abrit:abrit@127.0.0.1:5433/abrit_payload" }
if (-not $env:PAYLOAD_SECRET) { $env:PAYLOAD_SECRET = "local-check-secret-change-before-production" }

Push-Location $frontendRoot
try {
    & npm.cmd run check
    if ($LASTEXITCODE -ne 0) { throw "Payload/Next verification failed." }
}
finally {
    Pop-Location
}
