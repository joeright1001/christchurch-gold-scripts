# Simple build script - combines all .js files in current folder into main.js (minified)

Write-Host "Building main.js..." -ForegroundColor Cyan

# Get all .js files except main.js and this build script
$jsFiles = Get-ChildItem -Path . -Filter "*.js" | Where-Object { $_.Name -notin @("main.js", "build.ps1") } | Sort-Object Name

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

# Create temporary bundle file
$tempFile = "temp-bundle.js"
$combinedJs | Out-File -FilePath $tempFile -Encoding UTF8

# Minify to main.js
Write-Host "Minifying to main.js..." -ForegroundColor Yellow
$process = Start-Process -FilePath "cmd" -ArgumentList "/c", "npx terser `"$tempFile`" --compress --mangle --output main.js" -Wait -NoNewWindow -PassThru

# Clean up temp file
Remove-Item $tempFile -ErrorAction SilentlyContinue

if ($process.ExitCode -eq 0 -and (Test-Path "main.js")) {
    $originalSize = $combinedJs.Length
    $minifiedSize = (Get-Item "main.js").Length
    $savings = [math]::Round((($originalSize - $minifiedSize) / $originalSize) * 100, 1)
    
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "  Original: $([math]::Round($originalSize/1KB, 1))KB" -ForegroundColor Gray
    Write-Host "  Minified: $([math]::Round($minifiedSize/1KB, 1))KB" -ForegroundColor Gray
    Write-Host "  Saved: $savings%" -ForegroundColor Green
    Write-Host ""
    Write-Host "main.js is ready to use!" -ForegroundColor Green
} else {
    Write-Host "Minification failed! Make sure terser is available: npm install -g terser" -ForegroundColor Red
}
