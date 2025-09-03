# ShopEasy Customer App Deployment Script
# This script will help you deploy the customer app to GitHub

Write-Host "🚀 ShopEasy Customer App Deployment Script" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "customer-app\deploy-to-github")) {
    Write-Host "❌ Error: customer-app\deploy-to-github folder not found!" -ForegroundColor Red
    Write-Host "Please run this script from the shopeasy-clean directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Customer app deployment files found!" -ForegroundColor Green

# Show what files will be deployed
Write-Host "`n📁 Files ready for deployment:" -ForegroundColor Cyan
Get-ChildItem "customer-app\deploy-to-github" -Recurse | ForEach-Object {
    $icon = if ($_.PSIsContainer) { "📁" } else { "📄" }
    Write-Host "  $icon $($_.FullName.Replace("$PWD\", ""))" -ForegroundColor White
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to your shopeasy3 GitHub repository" -ForegroundColor White
Write-Host "2. Click 'Add file' → 'Upload files'" -ForegroundColor White
Write-Host "3. Select ALL files from: customer-app\deploy-to-github\" -ForegroundColor White
Write-Host "4. Commit with message: 'Deploy customer app v1.0'" -ForegroundColor White
Write-Host "5. Vercel will automatically deploy!" -ForegroundColor Green

Write-Host "`n🔗 Expected URL after deployment:" -ForegroundColor Cyan
Write-Host "   https://shopeasy3.vercel.app" -ForegroundColor White

Write-Host "`n⏳ Waiting for you to complete the GitHub upload..." -ForegroundColor Yellow
Write-Host "Press any key when you're ready to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "`n🎉 Deployment initiated! Check your Vercel dashboard for progress." -ForegroundColor Green


