# Place Order Head Build Script
# Combines CSS files for Webflow head section deployment

Write-Host "Building Place Order Head CSS..." -ForegroundColor Green

# Head folder - CSS files (to be included in Webflow head section)
$headFiles = @(
    "datepicker-styles.css",
    "dropdown-styles.css", 
    "form-styles.css",
    "timepicker-styles.css"
)

# Build combined head file (CSS)
$headOutput = "combined-styles.css"
Write-Host "Building $headOutput..." -ForegroundColor Yellow

"/* Combined CSS for Place Order - Generated $(Get-Date) */" | Out-File -FilePath $headOutput -Encoding UTF8
"" | Add-Content -Path $headOutput

foreach ($file in $headFiles) {
    if (Test-Path $file) {
        Write-Host "  Adding $file" -ForegroundColor Cyan
        "" | Add-Content -Path $headOutput
        "/* ===== $file ===== */" | Add-Content -Path $headOutput
        Get-Content $file | Add-Content -Path $headOutput
        "" | Add-Content -Path $headOutput
    } else {
        Write-Host "  Warning: $file not found" -ForegroundColor Red
    }
}

Write-Host "Head CSS build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "File created: $headOutput" -ForegroundColor Cyan
Write-Host ""
Write-Host "Usage:" -ForegroundColor White
Write-Host "  1. Copy contents of $headOutput to Webflow head section" -ForegroundColor Gray
Write-Host "  2. Add Flatpickr CDN links before this CSS:" -ForegroundColor Gray
Write-Host "     <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css'>" -ForegroundColor DarkGray
Write-Host "     <script src='https://cdn.jsdelivr.net/npm/flatpickr'></script>" -ForegroundColor DarkGray
