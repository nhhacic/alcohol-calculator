# Hướng Dẫn Deploy Lên GitHub Pages

## Bước 1: Tạo Repository trên GitHub

1. Đăng nhập vào https://github.com
2. Click nút **"+"** ở góc trên bên phải → **"New repository"**
3. Đặt tên repository: `alcohol-calculator` (hoặc tên bạn muốn)
4. Chọn **Public** (để GitHub Pages miễn phí)
5. **KHÔNG** tích vào "Initialize with README"
6. Click **"Create repository"**

## Bước 2: Cập nhật Remote URL

Sau khi tạo repository, GitHub sẽ hiển thị URL. Copy URL đó và chạy lệnh:

```powershell
cd d:\alcohol-calculator
git remote set-url origin https://github.com/YOUR_USERNAME/alcohol-calculator.git
```

(Thay `YOUR_USERNAME` bằng username GitHub của bạn)

## Bước 3: Commit và Push Code

```powershell
cd d:\alcohol-calculator
git add .
git commit -m "Deploy alcohol calculator webapp"
git push -u origin main
```

Nếu lần đầu push, GitHub có thể yêu cầu đăng nhập. Bạn có thể:
- Sử dụng GitHub Desktop (dễ hơn)
- Hoặc tạo Personal Access Token để push

## Bước 4: Bật GitHub Pages

1. Vào repository trên GitHub
2. Click tab **"Settings"**
3. Scroll xuống phần **"Pages"** (ở sidebar bên trái)
4. Trong phần **"Source"**:
   - Chọn **"Deploy from a branch"**
   - Branch: chọn **"main"**
   - Folder: chọn **"/ (root)"**
5. Click **"Save"**

## Bước 5: Đợi và Truy Cập

- Đợi 1-2 phút để GitHub build
- Truy cập: `https://YOUR_USERNAME.github.io/alcohol-calculator/`
- (Thay `YOUR_USERNAME` bằng username GitHub của bạn)

## Lưu ý

- Nếu có lỗi về file lock, chạy:
  ```powershell
  Remove-Item -Path ".git\index.lock" -Force
  ```

- Nếu chưa có icon, webapp vẫn hoạt động bình thường, chỉ không có icon khi cài đặt PWA

## Cài Đặt PWA trên Điện Thoại

### Android:
1. Mở webapp trên Chrome
2. Menu (3 chấm) → "Add to Home screen"

### iOS:
1. Mở webapp trên Safari  
2. Share → "Add to Home Screen"
