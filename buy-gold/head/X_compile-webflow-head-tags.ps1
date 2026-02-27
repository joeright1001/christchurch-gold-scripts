# Script to compile Webflow head tags
# Updates X_Inside 'head' tag.txt with the latest minified CSS and JS

$scriptDir = $PSScriptRoot
$targetFile = Join-Path $scriptDir "X_Inside 'head' tag.txt"
$cssFile = Join-Path $scriptDir "main.css"
$jsFile = Join-Path $scriptDir "main.js"

Write-Host "Compiling Webflow head tags..." -ForegroundColor Cyan

# 1. Get latest git tag (optional for head if everything is inline, but good for logging)
$latestTag = git describe --tags --abbrev=0 2>$null
if ($null -ne $latestTag) {
    Write-Host "Using version: $latestTag" -ForegroundColor Cyan
}

# 2. Read main.css
if (-not (Test-Path $cssFile)) {
    Write-Host "Error: main.css not found. Run build.ps1 first." -ForegroundColor Red
    return
}
$cssContent = Get-Content -Path $cssFile -Raw
$cssContent = $cssContent.Trim()

# 3. Read main.js
if (-not (Test-Path $jsFile)) {
    Write-Host "Error: main.js not found. Run build.ps1 first." -ForegroundColor Red
    return
}
$jsContent = Get-Content -Path $jsFile -Raw
$jsContent = $jsContent.Trim()

# 4. Read target file
if (-not (Test-Path $targetFile)) {
    Write-Host "Error: Target file '$targetFile' not found." -ForegroundColor Red
    return
}
$fileContent = Get-Content -Path $targetFile -Raw

# 5. Replace CSS content
# Regex to find <style>...</style>
# (?s) enables single-line mode (dot matches newline)
$cssRegex = "(?s)<style>.*?</style>"
$newCssBlock = "<style>`n$cssContent`n</style>"
$fileContent = $fileContent -replace $cssRegex, $newCssBlock

# 6. Replace JS content
# Regex to find <script>...</script>
$jsRegex = "(?s)<script>.*?</script>"
$newJsBlock = "<script>`n$jsContent`n</script>"
$fileContent = $fileContent -replace $jsRegex, $newJsBlock

# 7. Save file
$fileContent | Out-File -FilePath $targetFile -Encoding UTF8
Write-Host "Successfully updated $targetFile" -ForegroundColor Green
