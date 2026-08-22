$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$backendRoot = Join-Path $projectRoot "backend"
$pythonPath = Join-Path $backendRoot ".venv/Scripts/python.exe"
$previousApiUrl = $env:NEXT_PUBLIC_API_URL
$env:NEXT_PUBLIC_API_URL = "http://127.0.0.1:8010/api/v1"

Push-Location $projectRoot
try {
    & $pythonPath "backend/manage.py" check
    & $pythonPath -m pytest -q
    $djangoProcess = Start-Process -FilePath $pythonPath -ArgumentList "manage.py", "runserver", "127.0.0.1:8010", "--noreload" -WorkingDirectory $backendRoot -WindowStyle Hidden -PassThru
    $ready = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        try {
            $response = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8010/health/"
            if ($response.StatusCode -eq 200) { $ready = $true; break }
        }
        catch { Start-Sleep -Milliseconds 250 }
    }
    if (-not $ready) { throw "The temporary Django server did not become ready." }
    Push-Location "frontend"
    try {
        & npm.cmd run lint
        & npm.cmd run typecheck
        & npm.cmd run build
    }
    finally { Pop-Location }
}
finally {
    if ($djangoProcess -and -not $djangoProcess.HasExited) { Stop-Process -Id $djangoProcess.Id }
    $env:NEXT_PUBLIC_API_URL = $previousApiUrl
    Pop-Location
}
