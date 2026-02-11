# Máy Tính Nồng Độ Cồn

Ứng dụng web tính toán nồng độ cồn trong máu và thời gian hết cồn.

## Tính năng

- Tính toán nồng độ cồn (BAC) dựa trên giới tính, cân nặng và lượng đồ uống
- Tính thời gian hết cồn
- Hiển thị mức phạt theo Nghị định 168/2024/NĐ-CP
- Hỗ trợ nhiều loại đồ uống: Bia, Rượu mạnh, Rượu vang
- Progressive Web App (PWA) - có thể cài đặt như app trên điện thoại
- Giao diện responsive, tối ưu cho mobile

## Deploy lên GitHub Pages

### Bước 1: Tạo repository trên GitHub

1. Đăng nhập vào GitHub
2. Tạo repository mới (ví dụ: `alcohol-calculator`)
3. Không tích vào "Initialize with README"

### Bước 2: Upload files lên GitHub

**Cách 1: Sử dụng GitHub Desktop hoặc Git command line**

```bash
cd d:\alcohol-calculator
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/alcohol-calculator.git
git push -u origin main
```

**Cách 2: Upload trực tiếp qua web**

1. Vào repository vừa tạo trên GitHub
2. Click "uploading an existing file"
3. Kéo thả tất cả files vào
4. Commit changes

### Bước 3: Bật GitHub Pages

1. Vào Settings của repository
2. Scroll xuống phần "Pages"
3. Chọn Source: "Deploy from a branch"
4. Chọn Branch: "main" và folder: "/ (root)"
5. Click Save
6. Đợi vài phút, GitHub sẽ cung cấp URL: `https://YOUR_USERNAME.github.io/alcohol-calculator/`

## Tạo Icon cho PWA

Để PWA hoạt động đầy đủ, bạn cần tạo 2 file icon:

1. `icon-192.png` - kích thước 192x192px
2. `icon-512.png` - kích thước 512x512px

Bạn có thể:
- Tạo icon đơn giản với emoji 🍺 hoặc text "TC" (Tính Cồn)
- Sử dụng công cụ online như: https://www.favicon-generator.org/
- Hoặc tạm thời bỏ qua, app vẫn hoạt động nhưng không có icon khi cài đặt

## Cài đặt như App trên điện thoại

### Android (Chrome):
1. Mở webapp trên Chrome
2. Menu (3 chấm) → "Add to Home screen" hoặc "Install app"
3. Icon sẽ xuất hiện trên màn hình chính

### iOS (Safari):
1. Mở webapp trên Safari
2. Click nút Share (hình vuông với mũi tên)
3. Chọn "Add to Home Screen"
4. Icon sẽ xuất hiện trên màn hình chính

## Deploy lên các nền tảng khác

### Netlify (Miễn phí)
1. Vào https://www.netlify.com/
2. Đăng ký/đăng nhập
3. Kéo thả folder vào Netlify
4. Hoặc kết nối với GitHub repository

### Vercel (Miễn phí)
1. Vào https://vercel.com/
2. Đăng ký/đăng nhập
3. Import GitHub repository
4. Deploy tự động

## Lưu ý

- Service Worker chỉ hoạt động trên HTTPS (hoặc localhost)
- GitHub Pages tự động cung cấp HTTPS
- Nếu deploy lên nền tảng khác, đảm bảo có HTTPS
