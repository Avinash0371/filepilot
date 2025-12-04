# PowerShell script to add upload progress to all tool pages
# This script will be run manually to avoid errors

$toolsDir = "c:\Users\HP\Desktop\File pilot 2\app\tools"
$tools = @(
    "pdf-to-word", "word-to-pdf", "merge-pdf", "split-pdf", "compress-pdf",
    "images-to-pdf", "pdf-to-png", "pdf-to-ppt", "ppt-to-pdf", "pdf-to-text",
    "jpg-to-png", "png-to-jpg", "image-compressor", "image-to-webp",
    "background-remover", "add-background", "ocr-image", "zip-files",
    "unzip-files", "audio-converter", "video-converter", "video-compressor"
)

Write-Host "This script will guide you through adding upload progress to all tools" -ForegroundColor Green
Write-Host "Total tools to update: $($tools.Count)" -ForegroundColor Yellow
Write-Host ""

foreach ($tool in $tools) {
    $filePath = Join-Path $toolsDir "$tool\page.tsx"
    
    if (Test-Path $filePath) {
        Write-Host "✓ Found: $tool" -ForegroundColor Green
        
        # Read the file
        $content = Get-Content $filePath -Raw
        
        # Check if already has upload progress
        if ($content -match "uploadWithProgress") {
            Write-Host "  → Already has upload progress, skipping" -ForegroundColor Cyan
            continue
        }
        
        # Check if it has fetch calls
        if ($content -match "await fetch\(") {
            Write-Host "  → Has fetch calls, needs update" -ForegroundColor Yellow
        } else {
            Write-Host "  → No fetch calls found, skipping" -ForegroundColor Gray
        }
    } else {
        Write-Host "✗ Not found: $tool" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Analysis complete. Manual implementation recommended due to complexity." -ForegroundColor Yellow
Write-Host "Each tool page has different structure and needs careful modification." -ForegroundColor Yellow
