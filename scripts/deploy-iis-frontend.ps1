param(
    [Parameter(Mandatory = $true)]
    [string]$ArtifactZip,

    [Parameter(Mandatory = $true)]
    [string]$SiteName,

    [Parameter(Mandatory = $true)]
    [string]$AppPoolName,

    [Parameter(Mandatory = $true)]
    [string]$TargetPath,

    [string]$HealthUrl = "https://fitora.fitdnu.id.vn/"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

Import-Module WebAdministration -ErrorAction Stop

function Assert-PathInside {
    param(
        [Parameter(Mandatory = $true)][string]$Child,
        [Parameter(Mandatory = $true)][string]$Parent
    )

    $resolvedChild = [System.IO.Path]::GetFullPath($Child)
    $resolvedParent = [System.IO.Path]::GetFullPath($Parent)
    if (-not $resolvedChild.StartsWith($resolvedParent, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refuse to operate outside expected path. Child=$resolvedChild Parent=$resolvedParent"
    }
}

function Test-FrontendBundle {
    param([Parameter(Mandatory = $true)][string]$Root)

    $indexPath = Join-Path $Root "index.html"
    if (-not (Test-Path -LiteralPath $indexPath)) {
        throw "index.html is missing from deployment root: $Root"
    }

    $assetsPath = Join-Path $Root "assets"
    if (-not (Test-Path -LiteralPath $assetsPath)) {
        throw "assets directory is missing from deployment root: $Root"
    }

    $webConfigPath = Join-Path $Root "web.config"
    if (-not (Test-Path -LiteralPath $webConfigPath)) {
        throw "web.config is missing from deployment root: $Root"
    }

    $legacyMatches = Get-ChildItem -LiteralPath $Root -Recurse -File |
        Select-String "fitora-api\.aiotlab\.edu\.vn|fitora\.aiotlab\.edu\.vn"
    if ($legacyMatches) {
        $legacyMatches | Select-Object -First 20 Path, LineNumber | Format-Table | Out-String | Write-Host
        throw "Deployment bundle contains legacy Fitora domain."
    }

    $apiMatches = Get-ChildItem -LiteralPath $Root -Recurse -File |
        Select-String '"/api"'
    if (-not $apiMatches) {
        throw "Deployment bundle does not contain expected /api production API base."
    }

    $html = Get-Content -LiteralPath $indexPath -Raw
    $scriptMatches = [regex]::Matches($html, 'src="([^"]+\.js)"')
    if ($scriptMatches.Count -eq 0) {
        throw "index.html does not reference a JavaScript bundle."
    }

    foreach ($match in $scriptMatches) {
        $relative = $match.Groups[1].Value.TrimStart("/")
        $bundlePath = Join-Path $Root $relative
        if (-not (Test-Path -LiteralPath $bundlePath)) {
            throw "index.html references missing bundle: $relative"
        }
    }
}

$site = Get-Website -Name $SiteName -ErrorAction Stop
$appPool = Get-Item "IIS:\AppPools\$AppPoolName" -ErrorAction Stop

if (-not (Test-Path -LiteralPath $TargetPath)) {
    throw "Target path does not exist: $TargetPath"
}

$artifactFullPath = [System.IO.Path]::GetFullPath($ArtifactZip)
if (-not (Test-Path -LiteralPath $artifactFullPath)) {
    throw "Artifact zip does not exist: $artifactFullPath"
}

$deployRoot = Join-Path ([System.IO.Path]::GetTempPath()) "fitora-ui-deploy"
$extractPath = Join-Path $deployRoot "extract"
$candidatePath = Join-Path $deployRoot "candidate"
$backupRoot = Join-Path ([System.IO.Path]::GetDirectoryName($TargetPath)) "_fitora_backups"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$backupPath = Join-Path $backupRoot "$SiteName-$timestamp"

Remove-Item -LiteralPath $deployRoot -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $extractPath, $candidatePath, $backupRoot -Force | Out-Null

Expand-Archive -LiteralPath $artifactFullPath -DestinationPath $extractPath -Force
$distPath = Join-Path $extractPath "dist"
if (-not (Test-Path -LiteralPath $distPath)) {
    throw "Artifact must contain a top-level dist directory."
}

Copy-Item -Path (Join-Path $distPath "*") -Destination $candidatePath -Recurse -Force
Test-FrontendBundle -Root $candidatePath

Copy-Item -LiteralPath $TargetPath -Destination $backupPath -Recurse -Force

try {
    Stop-Website -Name $SiteName
    Stop-WebAppPool -Name $AppPoolName

    Get-ChildItem -LiteralPath $TargetPath -Force |
        Where-Object { $_.Name -ne "web.config" } |
        Remove-Item -Recurse -Force

    Copy-Item -Path (Join-Path $candidatePath "*") -Destination $TargetPath -Recurse -Force
    Test-FrontendBundle -Root $TargetPath

    Start-WebAppPool -Name $AppPoolName
    Start-Website -Name $SiteName

    $response = Invoke-WebRequest -Uri $HealthUrl -UseBasicParsing -TimeoutSec 30
    if ($response.StatusCode -ne 200) {
        throw "Frontend health check returned HTTP $($response.StatusCode)."
    }

    if ($response.Content -notmatch "<html|<div id=""root""") {
        throw "Frontend health check did not return expected SPA HTML."
    }
}
catch {
    Write-Host "Deployment failed. Restoring backup from $backupPath"
    Stop-Website -Name $SiteName -ErrorAction SilentlyContinue
    Stop-WebAppPool -Name $AppPoolName -ErrorAction SilentlyContinue

    Get-ChildItem -LiteralPath $TargetPath -Force | Remove-Item -Recurse -Force
    Copy-Item -Path (Join-Path $backupPath "*") -Destination $TargetPath -Recurse -Force

    Start-WebAppPool -Name $AppPoolName
    Start-Website -Name $SiteName
    throw
}
finally {
    Remove-Item -LiteralPath $deployRoot -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $artifactFullPath -Force -ErrorAction SilentlyContinue
}

Write-Host "Frontend deployment completed for site $($site.Name), app pool $($appPool.Name). Backup: $backupPath"
