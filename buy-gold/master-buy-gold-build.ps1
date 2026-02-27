# Master Build Script for Buy Gold Page
# Orchestrates the build and compilation process for both body and head sections.

$ErrorActionPreference = "Stop"

function Run-Step {
    param (
        [string]$ScriptPath,
        [string]$Description
    )

    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "STEP: $Description" -ForegroundColor Cyan
    Write-Host "Running: $ScriptPath" -ForegroundColor Gray
    Write-Host "========================================"

    if (-not (Test-Path $ScriptPath)) {
        Write-Host "Error: Script not found at $ScriptPath" -ForegroundColor Red
        exit 1
    }

    try {
        # Execute the script
        & $ScriptPath
        
        if ($LASTEXITCODE -ne 0) {
            throw "Script exited with code $LASTEXITCODE"
        }
        
        Write-Host "`nSUCCESS: $Description completed." -ForegroundColor Green
    }
    catch {
        Write-Host "`nFAILED: $Description failed." -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
}

# Define paths relative to this script
$scriptDir = $PSScriptRoot
$bodyBuild = Join-Path $scriptDir "body\build.ps1"
$bodyCompile = Join-Path $scriptDir "body\X_compile-webflow-body-tags.ps1"
$headBuild = Join-Path $scriptDir "head\build.ps1"
$headCompile = Join-Path $scriptDir "head\X_compile-webflow-head-tags.ps1"

# 1. Build Body
Run-Step -ScriptPath $bodyBuild -Description "Build Body (Minify JS/CSS)"

# 2. Compile Body Tags
Run-Step -ScriptPath $bodyCompile -Description "Compile Body Tags (Update Text File)"

# 3. Build Head
Run-Step -ScriptPath $headBuild -Description "Build Head (Minify JS/CSS)"

# 4. Compile Head Tags
Run-Step -ScriptPath $headCompile -Description "Compile Head Tags (Update Text File)"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "MASTER BUILD COMPLETE" -ForegroundColor Green
Write-Host "All scripts processed successfully." -ForegroundColor Green
Write-Host "========================================"
