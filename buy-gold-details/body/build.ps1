# Portable build script - combines all .js files in the script's folder into main.js (minified)
# This script can be run from any directory within the git repository.

# $PSScriptRoot is the directory where the script is located.
$scriptDir = $PSScriptRoot

Write-Host "Building main.js in folder: $scriptDir" -ForegroundColor Cyan

# Get all .js files except main.js and this build script
$jsFiles = Get-ChildItem -Path $scriptDir -Filter "*.js" | Where-Object { $_.Name -notin @("main.js", "build.ps1") } | Sort-Object Name

if ($jsFiles.Count -eq 0) {
    Write-Host "No JavaScript files found to bundle!" -ForegroundColor Red
    return
}

Write-Host "Bundling $($jsFiles.Count) files:" -ForegroundColor Yellow
$jsFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }

# Combine all files
$bundleContent = @()
$bundleContent += "/* Combined JS - Generated $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') */"

foreach ($file in $jsFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $bundleContent += "`n/* === $($file.Name) === */"
    $bundleContent += $content.TrimEnd()
}

$combinedJs = $bundleContent -join "`n"

# Create temporary bundle file in the script's directory
$tempFile = Join-Path $scriptDir "temp-bundle.js"
$outputFile = Join-Path $scriptDir "main.js"
$combinedJs | Out-File -FilePath $tempFile -Encoding UTF8

# Minify to main.js
Write-Host "Minifying to $outputFile..." -ForegroundColor Yellow
$process = Start-Process -FilePath "cmd" -ArgumentList "/c", "npx terser `"$tempFile`" --compress --mangle --output `"$outputFile`"" -Wait -NoNewWindow -PassThru

# Clean up temp file
Remove-Item $tempFile -ErrorAction SilentlyContinue

if ($process.ExitCode -eq 0 -and (Test-Path $outputFile)) {
    $originalSize = $combinedJs.Length
    $minifiedSize = (Get-Item $outputFile).Length
    $savings = [math]::Round((($originalSize - $minifiedSize) / $originalSize) * 100, 1)
    
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "  Original: $([math]::Round($originalSize/1KB, 1))KB" -ForegroundColor Gray
    Write-Host "  Minified: $([math]::Round($minifiedSize/1KB, 1))KB" -ForegroundColor Gray
    Write-Host "  Saved: $savings%" -ForegroundColor Green
    Write-Host ""
    Write-Host "main.js is ready to use!" -ForegroundColor Green

    Write-Host ""
    Write-Host "----------------------------------------" -ForegroundColor DarkCyan
    Write-Host "Starting Git deployment process..." -ForegroundColor Cyan
    Write-Host "----------------------------------------"

    # Automatic versioning
    $latestTag = git describe --tags --abbrev=0 2>$null
    $newVersion = ""

    if ($null -eq $latestTag) {
        Write-Host "No existing tags found. Starting with v1.0.0" -ForegroundColor Yellow
        $newVersion = "v1.0.0"
    } else {
        Write-Host "Latest tag found: $latestTag" -ForegroundColor Green
        try {
            $parts = $latestTag.Substring(1).Split('.')
            $major = [int]$parts[0]
            $minor = [int]$parts[1]
            $patch = [int]$parts[2]
            $patch++ # Increment patch version
            $newVersion = "v$major.$minor.$patch"
            Write-Host "New version will be: $newVersion" -ForegroundColor Cyan
        } catch {
            Write-Host "Could not parse tag '$latestTag'. Please ensure it follows 'vX.Y.Z' format." -ForegroundColor Red
            return
        }
    }

    # Git commands
    Write-Host "Staging files..." -ForegroundColor Yellow
    git add .
    
    $commitMessage = "Build and release $newVersion"
    Write-Host "Committing with message: `"$commitMessage`"" -ForegroundColor Yellow
    git commit -m "$commitMessage"
    
    Write-Host "Creating tag $newVersion..." -ForegroundColor Yellow
    git tag -a "$newVersion" -m "$commitMessage"
    
    Write-Host "Pushing to main branch..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host "Pushing tag $newVersion..." -ForegroundColor Yellow
    git push origin "$newVersion"
    
    Write-Host "----------------------------------------" -ForegroundColor DarkCyan
    Write-Host "Deployment complete!" -ForegroundColor Green
    # Dynamically generate the URL
    $repoRoot = git rev-parse --show-toplevel
    $relativePath = $scriptDir.Substring($repoRoot.Length + 1).Replace('\', '/')
    $fileUrl = "https://cdn.jsdelivr.net/gh/joeright1001/christchurch-gold-scripts@$($newVersion)/$($relativePath)/main.js"

    Write-Host "URL for this version:" -ForegroundColor White
    Write-Host $fileUrl -ForegroundColor Magenta

} else {
    Write-Host "Minification failed! Make sure terser is available: npm install -g terser" -ForegroundColor Red
}
