# ShopEasy Complete Deployment Script
# This script will guide you through deploying both apps to GitHub

Write-Host "=== ShopEasy Complete Deployment Script ===" -ForegroundColor Green
Write-Host "Deploying Admin App (shopeasy2) and Customer App (shopeasy3)" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "admin-app\deploy-to-github") -or -not (Test-Path "customer-app\deploy-to-github")) {
    Write-Host "ERROR: Deployment folders not found!" -ForegroundColor Red
    Write-Host "Please run this script from the shopeasy-clean directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "SUCCESS: All deployment files found!" -ForegroundColor Green

# ========================================
# STEP 1: DEPLOY ADMIN APP (shopeasy2)
# ========================================
Write-Host "`n=== STEP 1: Deploy Admin App to shopeasy2 ===" -ForegroundColor Yellow

Write-Host "Admin app files ready:" -ForegroundColor Cyan
Get-ChildItem "admin-app\deploy-to-github" -Recurse | ForEach-Object {
    $icon = if ($_.PSIsContainer) { "[DIR]" } else { "[FILE]" }
    $relativePath = $_.FullName.Replace("$PWD\", "")
    Write-Host "  $icon $relativePath" -ForegroundColor White
}

Write-Host "`nGo to your shopeasy2 GitHub repository:" -ForegroundColor Yellow
Write-Host "   https://github.com/YOUR_USERNAME/shopeasy2" -ForegroundColor White

Write-Host "`nAdmin App Upload Steps:" -ForegroundColor Cyan
Write-Host "1. Click 'Add file' → 'Upload files'" -ForegroundColor White
Write-Host "2. Select ALL files from: admin-app\deploy-to-github\" -ForegroundColor White
Write-Host "3. Commit message: 'Deploy admin dashboard v1.0'" -ForegroundColor White
Write-Host "4. Click 'Commit changes'" -ForegroundColor White

Write-Host "`nPress any key when you've uploaded the admin app..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "SUCCESS: Admin app uploaded! Vercel is deploying..." -ForegroundColor Green

# ========================================
# STEP 2: DEPLOY CUSTOMER APP (shopeasy3)
# ========================================
Write-Host "`n=== STEP 2: Deploy Customer App to shopeasy3 ===" -ForegroundColor Yellow

Write-Host "Customer app files ready:" -ForegroundColor Cyan
Get-ChildItem "customer-app\deploy-to-github" -Recurse | ForEach-Object {
    $icon = if ($_.PSIsContainer) { "[DIR]" } else { "[FILE]" }
    $relativePath = $_.FullName.Replace("$PWD\", "")
    Write-Host "  $icon $relativePath" -ForegroundColor White
}

Write-Host "`nGo to your shopeasy3 GitHub repository:" -ForegroundColor Yellow
Write-Host "   https://github.com/YOUR_USERNAME/shopeasy3" -ForegroundColor White

Write-Host "`nCustomer App Upload Steps:" -ForegroundColor Cyan
Write-Host "1. Click 'Add file' → 'Upload files'" -ForegroundColor White
Write-Host "2. Select ALL files from: customer-app\deploy-to-github\" -ForegroundColor White
Write-Host "3. Commit message: 'Deploy customer app v1.0'" -ForegroundColor White
Write-Host "4. Click 'Commit changes'" -ForegroundColor White

Write-Host "`nPress any key when you've uploaded the customer app..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "SUCCESS: Customer app uploaded! Vercel is deploying..." -ForegroundColor Green

# ========================================
# FINAL STATUS
# ========================================
Write-Host "`n=== DEPLOYMENT COMPLETE! ===" -ForegroundColor Green

Write-Host "`nYour apps will be available at:" -ForegroundColor Cyan
Write-Host "   Admin Dashboard: https://shopeasy2.vercel.app" -ForegroundColor White
Write-Host "   Customer App:   https://shopeasy3.vercel.app" -ForegroundColor White

Write-Host "`nCheck deployment status:" -ForegroundColor Yellow
Write-Host "   Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White

Write-Host "`nDeployment typically takes 2-5 minutes" -ForegroundColor Gray
Write-Host "   Vercel will automatically build and deploy your apps" -ForegroundColor Gray

Write-Host "`nHappy coding with your organized ShopEasy project!" -ForegroundColor Green
