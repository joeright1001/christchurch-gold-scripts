# Enhanced build script - combines and minifies both .js and .css files
# This script can be run from any directory within the git repository.

# $PSScriptRoot is the directory where the script is located.
$scriptDir = $PSScriptRoot

Write-Host "Building main.js and main.css in folder: $scriptDir" -ForegroundColor Cyan

# Get all .js files except main.js and this build script
$jsFiles = Get-ChildItem -Path $scriptDir -Filter "*.js" | Where-Object { $_.Name -notin @("main.js", "build.ps1") } | Sort-Object Name

# Get all .css files except main.css
$cssFiles = Get-ChildItem -Path $scriptDir -Filter "*.css" | Where-Object { $_.Name -ne "main.css" } | Sort-Object Name

if ($jsFiles.Count -eq 0 -and $cssFiles.Count -eq 0) {
    Write-Host "No JavaScript or CSS files found to bundle!" -ForegroundColor Red
    return
}

# ==================== JAVASCRIPT BUNDLING ====================
$jsSuccess = $false
$jsOriginalSize = 0
$jsMinifiedSize = 0

if ($jsFiles.Count -gt 0) {
    Write-Host "Bundling $($jsFiles.Count) JavaScript files:" -ForegroundColor Yellow
    $jsFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }

    # Combine all JS files
    $bundleContent = @()
    $bundleContent += "/* Combined JS - Generated $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') */"

    foreach ($file in $jsFiles) {
        $content = Get-Content -Path $file.FullName -Raw
        $bundleContent += "`n/* === $($file.Name) === */"
        $bundleContent += $content.TrimEnd()
    }

    $combinedJs = $bundleContent -join "`n"

    # Create temporary bundle file in the script's directory
    $tempJsFile = Join-Path $scriptDir "temp-bundle.js"
    $outputJsFile = Join-Path $scriptDir "main.js"
    $combinedJs | Out-File -FilePath $tempJsFile -Encoding UTF8

    # Minify to main.js
    Write-Host "Minifying JavaScript to main.js..." -ForegroundColor Yellow
    $jsProcess = Start-Process -FilePath "cmd" -ArgumentList "/c", "npx terser `"$tempJsFile`" --compress --mangle --output `"$outputJsFile`"" -Wait -NoNewWindow -PassThru

    # Clean up temp file
    Remove-Item $tempJsFile -ErrorAction SilentlyContinue

    if ($jsProcess.ExitCode -eq 0 -and (Test-Path $outputJsFile)) {
        $jsOriginalSize = $combinedJs.Length
        $jsMinifiedSize = (Get-Item $outputJsFile).Length
        $jsSavings = [math]::Round((($jsOriginalSize - $jsMinifiedSize) / $jsOriginalSize) * 100, 1)
        
        Write-Host "JavaScript Success!" -ForegroundColor Green
        Write-Host "  Original: $([math]::Round($jsOriginalSize/1KB, 1))KB" -ForegroundColor Gray
        Write-Host "  Minified: $([math]::Round($jsMinifiedSize/1KB, 1))KB" -ForegroundColor Gray
        Write-Host "  Saved: $jsSavings%" -ForegroundColor Green
        $jsSuccess = $true
    } else {
        Write-Host "JavaScript minification failed! Make sure terser is available: npm install -g terser" -ForegroundColor Red
    }
}

# ==================== CSS BUNDLING ====================
$cssSuccess = $false
$cssOriginalSize = 0
$cssMinifiedSize = 0

if ($cssFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Bundling $($cssFiles.Count) CSS files:" -ForegroundColor Yellow
    $cssFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }

    # Combine all CSS files
    $cssBundleContent = @()
    $cssBundleContent += "/* Combined CSS - Generated $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') */"

    foreach ($file in $cssFiles) {
        $content = Get-Content -Path $file.FullName -Raw
        $cssBundleContent += "`n/* === $($file.Name) === */"
        $cssBundleContent += $content.TrimEnd()
    }

    $combinedCss = $cssBundleContent -join "`n"

    # Create temporary CSS bundle file
    $tempCssFile = Join-Path $scriptDir "temp-bundle.css"
    $outputCssFile = Join-Path $scriptDir "main.css"
    $combinedCss | Out-File -FilePath $tempCssFile -Encoding UTF8

    # Minify CSS using clean-css-cli
    Write-Host "Minifying CSS to main.css..." -ForegroundColor Yellow
    $cssProcess = Start-Process -FilePath "cmd" -ArgumentList "/c", "npx cleancss `"$tempCssFile`" --output `"$outputCssFile`"" -Wait -NoNewWindow -PassThru

    # Clean up temp file
    Remove-Item $tempCssFile -ErrorAction SilentlyContinue

    if ($cssProcess.ExitCode -eq 0 -and (Test-Path $outputCssFile)) {
        $cssOriginalSize = $combinedCss.Length
        $cssMinifiedSize = (Get-Item $outputCssFile).Length
        $cssSavings = [math]::Round((($cssOriginalSize - $cssMinifiedSize) / $cssOriginalSize) * 100, 1)
        
        Write-Host "CSS Success!" -ForegroundColor Green
        Write-Host "  Original: $([math]::Round($cssOriginalSize/1KB, 1))KB" -ForegroundColor Gray
        Write-Host "  Minified: $([math]::Round($cssMinifiedSize/1KB, 1))KB" -ForegroundColor Gray
        Write-Host "  Saved: $cssSavings%" -ForegroundColor Green
        $cssSuccess = $true
    } else {
        Write-Host "CSS minification failed! Installing clean-css-cli..." -ForegroundColor Yellow
        $installProcess = Start-Process -FilePath "cmd" -ArgumentList "/c", "npm install -g clean-css-cli" -Wait -NoNewWindow -PassThru
        
        if ($installProcess.ExitCode -eq 0) {
            Write-Host "Retrying CSS minification..." -ForegroundColor Yellow
            $tempCssFile = Join-Path $scriptDir "temp-bundle.css"
            $combinedCss | Out-File -FilePath $tempCssFile -Encoding UTF8
            $cssProcess2 = Start-Process -FilePath "cmd" -ArgumentList "/c", "npx cleancss `"$tempCssFile`" --output `"$outputCssFile`"" -Wait -NoNewWindow -PassThru
            Remove-Item $tempCssFile -ErrorAction SilentlyContinue
            
            if ($cssProcess2.ExitCode -eq 0 -and (Test-Path $outputCssFile)) {
                $cssOriginalSize = $combinedCss.Length
                $cssMinifiedSize = (Get-Item $outputCssFile).Length
                $cssSavings = [math]::Round((($cssOriginalSize - $cssMinifiedSize) / $cssOriginalSize) * 100, 1)
                
                Write-Host "CSS Success!" -ForegroundColor Green
                Write-Host "  Original: $([math]::Round($cssOriginalSize/1KB, 1))KB" -ForegroundColor Gray
                Write-Host "  Minified: $([math]::Round($cssMinifiedSize/1KB, 1))KB" -ForegroundColor Gray
                Write-Host "  Saved: $cssSavings%" -ForegroundColor Green
                $cssSuccess = $true
            } else {
                Write-Host "CSS minification still failed after installing clean-css-cli" -ForegroundColor Red
            }
        } else {
            Write-Host "Failed to install clean-css-cli" -ForegroundColor Red
        }
    }
}

# ==================== SUMMARY ====================
Write-Host ""
if ($jsSuccess -or $cssSuccess) {
    Write-Host "Build Summary:" -ForegroundColor Green
    if ($jsSuccess) {
        Write-Host "  ✓ main.js created and minified" -ForegroundColor Green
    }
    if ($cssSuccess) {
        Write-Host "  ✓ main.css created and minified" -ForegroundColor Green
    }
    
    $totalOriginal = $jsOriginalSize + $cssOriginalSize
    $totalMinified = $jsMinifiedSize + $cssMinifiedSize
    $totalSavings = if ($totalOriginal -gt 0) { [math]::Round((($totalOriginal - $totalMinified) / $totalOriginal) * 100, 1) } else { 0 }
    
    Write-Host "  Total size reduction: $totalSavings%" -ForegroundColor Cyan

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
    
    # Dynamically generate URLs for both files
    $repoRoot = git rev-parse --show-toplevel
    $relativePath = $scriptDir.Substring($repoRoot.Length + 1).Replace('\', '/')
    
    Write-Host "CDN URLs for this version:" -ForegroundColor White
    if ($jsSuccess) {
        $jsUrl = "https://cdn.jsdelivr.net/gh/joeright1001/christchurch-gold-scripts@$($newVersion)/$($relativePath)/main.js"
        Write-Host "JavaScript: $jsUrl" -ForegroundColor Magenta
    }
    if ($cssSuccess) {
        $cssUrl = "https://cdn.jsdelivr.net/gh/joeright1001/christchurch-gold-scripts@$($newVersion)/$($relativePath)/main.css"
        Write-Host "CSS: $cssUrl" -ForegroundColor Magenta
    }

} else {
    Write-Host "Build failed! No files were successfully minified." -ForegroundColor Red
}
