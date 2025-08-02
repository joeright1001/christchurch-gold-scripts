# Build script wrapper - calls the central build-core.ps1 script
# This allows you to run .\build.ps1 from this directory while using centralized build logic

Write-Host "Calling central build script for: $PSScriptRoot" -ForegroundColor Cyan

# Call the central build script, passing this directory as the target
& "$PSScriptRoot\..\..\build-core.ps1" -TargetDirectory $PSScriptRoot
