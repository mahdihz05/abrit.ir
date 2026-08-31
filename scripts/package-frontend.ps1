$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$frontendRoot = Join-Path $projectRoot "frontend"
$standaloneRoot = Join-Path $frontendRoot ".next/standalone"
$standaloneFrontend = Join-Path $standaloneRoot "frontend"
$artifactsRoot = Join-Path $projectRoot "artifacts"
$archivePath = Join-Path $artifactsRoot "abrit-frontend-standalone.tar.gz"
$packageLockPath = Join-Path $frontendRoot "package-lock.json"

$env:NEXT_PUBLIC_SITE_URL = "https://abrit.cloud"
$env:NEXT_PUBLIC_API_URL = "https://abrit.cloud/cms/api/v1"
$env:BACKEND_API_URL = "https://abrit.cloud/cms/api/v1"

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
Copy-Item -Force (Join-Path $projectRoot "abrit-homepage-polished-v5.html") $standaloneRoot
Copy-Item -Force (Join-Path $PSScriptRoot "cpanel-standalone-server.js") (Join-Path $standaloneRoot "server.js")
Copy-Item -Force (Join-Path $PSScriptRoot "cpanel-standalone-package.json") (Join-Path $standaloneRoot "package.json")

New-Item -ItemType Directory -Force $artifactsRoot | Out-Null

# The build runs on Windows while CloudLinux runs on Linux x64. Next's image
# optimizer traces the host Sharp binary, so bundle the matching Linux native
# packages now and keep the server deployment completely install-free.
$packageLockContent = Get-Content -Raw -LiteralPath $packageLockPath
function Get-LockedPackageVersion([string]$packageName) {
    $packageKey = [regex]::Escape(('"node_modules/' + $packageName + '"'))
    $match = [regex]::Match($packageLockContent, $packageKey + '\s*:\s*\{\s*"version"\s*:\s*"([^"]+)"')
    if (-not $match.Success) { throw "Could not resolve $packageName from package-lock.json." }
    return $match.Groups[1].Value
}
$linuxNativePackages = @(
    @{
        Name = "@img/sharp-linux-x64"
        Version = Get-LockedPackageVersion "@img/sharp-linux-x64"
    },
    @{
        Name = "@img/sharp-libvips-linux-x64"
        Version = Get-LockedPackageVersion "@img/sharp-libvips-linux-x64"
    }
)
$runtimeStage = Join-Path ([System.IO.Path]::GetTempPath()) ("abrit-linux-runtime-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $runtimeStage | Out-Null
$resolvedRuntimeStage = (Resolve-Path -LiteralPath $runtimeStage).Path
$resolvedTempRoot = (Resolve-Path -LiteralPath ([System.IO.Path]::GetTempPath())).Path.TrimEnd('\')
if (-not $resolvedRuntimeStage.StartsWith("$resolvedTempRoot\", [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to use a runtime staging path outside the system temp directory."
}

try {
    foreach ($runtimePackage in $linuxNativePackages) {
        if (-not $runtimePackage.Version) { throw "Could not resolve $($runtimePackage.Name) from package-lock.json." }
        $packageStage = Join-Path $runtimeStage ($runtimePackage.Name -replace '[/@]', '-')
        New-Item -ItemType Directory -Path $packageStage | Out-Null
        & npm.cmd pack "$($runtimePackage.Name)@$($runtimePackage.Version)" --pack-destination $packageStage | Out-Host
        if ($LASTEXITCODE -ne 0) { throw "Downloading $($runtimePackage.Name) failed." }
        $packageArchive = Get-ChildItem -LiteralPath $packageStage -Filter '*.tgz' | Select-Object -First 1
        if (-not $packageArchive) { throw "The archive for $($runtimePackage.Name) was not created." }
        $targetName = $runtimePackage.Name.Split('/')[-1]
        $targetPath = Join-Path $standaloneFrontend "node_modules/@img/$targetName"
        New-Item -ItemType Directory -Force -Path $targetPath | Out-Null
        & tar.exe -xzf $packageArchive.FullName -C $targetPath --strip-components=1
        if ($LASTEXITCODE -ne 0) { throw "Extracting $($runtimePackage.Name) failed." }
    }
}
finally {
    if (Test-Path -LiteralPath $resolvedRuntimeStage) {
        Remove-Item -Recurse -Force -LiteralPath $resolvedRuntimeStage
    }
}

if (Test-Path -LiteralPath $archivePath) { Remove-Item -LiteralPath $archivePath }
& tar.exe -czf $archivePath -C $standaloneRoot .
if ($LASTEXITCODE -ne 0) { throw "Creating the standalone archive failed." }

Write-Output $archivePath
