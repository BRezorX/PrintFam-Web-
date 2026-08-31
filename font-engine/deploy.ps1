# ==============================================================================
# PrintBolt Font Engine - Google Cloud Run Free Tier Deployment Script
# ==============================================================================

param(
    [string]$ProjectName = "printbolt-font-engine",
    [string]$Region = "us-central1"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Deploying PrintBolt Font Engine to Google Cloud Run (Free)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check if gcloud CLI is installed
$gcloudCheck = Get-Command "gcloud" -ErrorAction SilentlyContinue
if (-not $gcloudCheck) {
    Write-Host "`n[!] Google Cloud SDK (gcloud) is not detected in your PATH." -ForegroundColor Yellow
    Write-Host "Please install the Google Cloud CLI from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    Write-Host "Or you can deploy directly via Google Cloud Console in 3 clicks (see README.md)." -ForegroundColor Yellow
    exit 1
}

# 2. Deploy source directly to Cloud Run
Write-Host "`n[Step 1/2] Building and deploying container to Google Cloud Run..." -ForegroundColor Magenta
Push-Location $PSScriptRoot
try {
    gcloud run deploy $ProjectName `
        --source . `
        --region $Region `
        --allow-unauthenticated `
        --memory 1Gi `
        --cpu 1 `
        --min-instances 0 `
        --max-instances 10 `
        --concurrency 80 `
        --port 3000

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n[Step 2/2] Fetching Service URL..." -ForegroundColor Magenta
        $serviceUrl = (gcloud run services describe $ProjectName --region $Region --format "value(status.url)").Trim()
        
        Write-Host "`n==========================================================" -ForegroundColor Green
        Write-Host " FONT ENGINE DEPLOYED SUCCESSFULLY!" -ForegroundColor Green
        Write-Host " Service URL: $serviceUrl" -ForegroundColor Green
        Write-Host "==========================================================" -ForegroundColor Green
        Write-Host "`nNext Step: Set this URL in your Cloudflare Pages / Next.js .env.local:"
        Write-Host "DOC_CONVERTER_URL=$serviceUrl" -ForegroundColor Yellow
    } else {
        Write-Error "Deployment failed. Please check the gcloud error log above."
    }
} finally {
    Pop-Location
}
