# Script deploy lên GitHub Pages
Write-Host "=== Deploy Alcohol Calculator ===" -ForegroundColor Green

# Xóa file lock nếu có
if (Test-Path ".git\index.lock") {
    Write-Host "Removing lock file..." -ForegroundColor Yellow
    Remove-Item -Path ".git\index.lock" -Force
}

# Kiểm tra remote
Write-Host "`nChecking remote..." -ForegroundColor Cyan
git remote -v

Write-Host "`n=== IMPORTANT ===" -ForegroundColor Red
Write-Host "1. Tạo repository trên GitHub: https://github.com/new" -ForegroundColor Yellow
Write-Host "2. Cập nhật remote URL:" -ForegroundColor Yellow
Write-Host "   git remote set-url origin https://github.com/YOUR_USERNAME/alcohol-calculator.git" -ForegroundColor White
Write-Host "`n3. Sau đó chạy các lệnh sau:" -ForegroundColor Yellow
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m 'Deploy alcohol calculator'" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host "`n4. Bật GitHub Pages trong Settings > Pages" -ForegroundColor Yellow

# Hỏi có muốn tiếp tục không
$continue = Read-Host "`nBạn đã tạo repository trên GitHub chưa? (y/n)"
if ($continue -eq "y" -or $continue -eq "Y") {
    Write-Host "`nNhập username GitHub của bạn:" -ForegroundColor Cyan
    $username = Read-Host
    
    if ($username) {
        Write-Host "`nCập nhật remote URL..." -ForegroundColor Yellow
        git remote set-url origin "https://github.com/$username/alcohol-calculator.git"
        
        Write-Host "`nAdding files..." -ForegroundColor Yellow
        git add .
        
        Write-Host "Committing..." -ForegroundColor Yellow
        git commit -m "Deploy alcohol calculator webapp"
        
        Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
        Write-Host "Nếu được hỏi đăng nhập, hãy nhập Personal Access Token thay vì password" -ForegroundColor Cyan
        git push -u origin main
        
        Write-Host "`n=== SUCCESS ===" -ForegroundColor Green
        Write-Host "Bây giờ vào Settings > Pages và bật GitHub Pages!" -ForegroundColor Yellow
        Write-Host "URL sẽ là: https://$username.github.io/alcohol-calculator/" -ForegroundColor Cyan
    }
} else {
    Write-Host "`nVui lòng tạo repository trên GitHub trước!" -ForegroundColor Yellow
    Write-Host "Sau đó chạy lại script này." -ForegroundColor Yellow
}
