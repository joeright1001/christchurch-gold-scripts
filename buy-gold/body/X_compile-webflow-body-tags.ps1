# Script to compile Webflow body tags
# Updates X_Inside 'body' tag.txt with the latest minified CSS and version number

$scriptDir = $PSScriptRoot
$targetFile = Join-Path $scriptDir "X_Inside 'body' tag.txt"
$cssFile = Join-Path $scriptDir "main.css"

Write-Host "Compiling Webflow body tags..." -ForegroundColor Cyan

# 1. Get latest git tag
$latestTag = git describe --tags --abbrev=0 2>$null
if ($null -eq $latestTag) {
    Write-Host "Error: No git tags found." -ForegroundColor Red
    return
}
Write-Host "Using version: $latestTag" -ForegroundColor Cyan

# 2. Read main.css
if (-not (Test-Path $cssFile)) {
    Write-Host "Error: main.css not found. Run build.ps1 first." -ForegroundColor Red
    return
}
$cssContent = Get-Content -Path $cssFile -Raw
$cssContent = $cssContent.Trim()

# 3. Read target file
if (-not (Test-Path $targetFile)) {
    Write-Host "Error: Target file '$targetFile' not found." -ForegroundColor Red
    return
}
$fileContent = Get-Content -Path $targetFile -Raw

# 4. Replace CSS content
# Regex to find <style>...</style>
# (?s) enables single-line mode (dot matches newline)
$cssRegex = "(?s)<style>.*?</style>"
$newCssBlock = "<style>`n$cssContent`n</style>"
$fileContent = $fileContent -replace $cssRegex, $newCssBlock

# 5. Replace CDN version
# Regex to find the version in the CDN URL
# URL format: https://cdn.jsdelivr.net/gh/joeright1001/christchurch-gold-scripts@v1.0.318/buy-gold/body/main.js
$versionRegex = "christchurch-gold-scripts@v[0-9]+\.[0-9]+\.[0-9]+"
$newVersionString = "christchurch-gold-scripts@$latestTag"
$fileContent = $fileContent -replace $versionRegex, $newVersionString

# 6. Save file
$fileContent | Out-File -FilePath $targetFile -Encoding UTF8
Write-Host "Successfully updated $targetFile" -ForegroundColor Green
