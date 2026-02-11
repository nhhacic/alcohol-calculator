# Quick Deploy Script
Write-Host "=== Quick Deploy Alcohol Calculator ===" -ForegroundColor Green

# Xóa file lock
Write-Host "`nRemoving lock file..." -ForegroundColor Yellow
if (Test-Path ".git\index.lock") {
    Remove-Item -Path ".git\index.lock" -Force
    Start-Sleep -Seconds 1
}

# Add và commit
Write-Host "Adding files..." -ForegroundColor Cyan
git add .

Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m "Update: Add time tracking and fix date format to dd/mm/yyyy"

# Kiểm tra remote
Write-Host "`nCurrent remote:" -ForegroundColor Yellow
git remote -v

Write-Host "`n=== NEXT STEPS ===" -ForegroundColor Green
Write-Host "1. Nếu chưa có repository trên GitHub:" -ForegroundColor Yellow
Write-Host "   - Tạo tại: https://github.com/new" -ForegroundColor White
Write-Host "   - Tên: alcohol-calculator" -ForegroundColor White
Write-Host "   - Public repository" -ForegroundColor White
Write-Host "`n2. Cập nhật remote URL (thay YOUR_USERNAME):" -ForegroundColor Yellow
Write-Host "   git remote set-url origin https://github.com/YOUR_USERNAME/alcohol-calculator.git" -ForegroundColor White
Write-Host "`n3. Push code:" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host "`n4. Bật GitHub Pages:" -ForegroundColor Yellow
Write-Host "   - Vào Settings > Pages" -ForegroundColor White
Write-Host "   - Source: Deploy from branch 'main'" -ForegroundColor White
Write-Host "`nHoặc chạy script tự động:" -ForegroundColor Cyan
$auto = Read-Host "Bạn đã có repository trên GitHub chưa? (y/n)"

if ($auto -eq "y" -or $auto -eq "Y") {
    $username = Read-Host "Nhập GitHub username của bạn"
    if ($username) {
        Write-Host "`nCập nhật remote..." -ForegroundColor Yellow
        git remote set-url origin "https://github.com/$username/alcohol-calculator.git"
        
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        Write-Host "(Nếu được hỏi đăng nhập, dùng Personal Access Token)" -ForegroundColor Cyan
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n=== SUCCESS! ===" -ForegroundColor Green
            Write-Host "Bây giờ vào Settings > Pages và bật GitHub Pages!" -ForegroundColor Yellow
            Write-Host "URL sẽ là: https://$username.github.io/alcohol-calculator/" -ForegroundColor Cyan
        } else {
            Write-Host "`nPush failed. Vui lòng kiểm tra lại." -ForegroundColor Red
        }
    }
}
