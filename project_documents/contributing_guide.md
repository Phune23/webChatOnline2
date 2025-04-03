# 👨‍💻 Hướng Dẫn Đóng Góp Cho Dự Án `webchatonline2`

Cảm ơn bạn đã quan tâm đến dự án **Web Chat Online**! Để đảm bảo code luôn sạch sẽ, dễ bảo trì và dễ phát triển, vui lòng tuân thủ các quy tắc sau khi đóng góp vào dự án.

---

## 🏷️ 1. Quy Tắc Đặt Tên Nhánh (Branch Naming)

Khi làm việc trên một tính năng hoặc sửa lỗi, bạn cần tạo một nhánh riêng biệt theo quy tắc:

```
<type>/<mô-tả-ngắn-gọn>
```
Ví dụ:
- `feature/chat-ui` → Phát triển giao diện chat
- `fix/auth-bug` → Sửa lỗi đăng nhập
- `hotfix/socket-connection` → Fix lỗi khẩn cấp về kết nối Socket.IO

---

## 🔥 2. Quy Tắc Commit Message (Theo **Conventional Commits**)

Cấu trúc commit message chuẩn:
```
<type>(scope): <mô tả ngắn gọn>
```
**Các loại commit:**
- `feat` → Thêm tính năng mới
- `fix` → Sửa lỗi
- `docs` → Cập nhật tài liệu
- `style` → Cải thiện giao diện, CSS
- `refactor` → Tối ưu code mà không thay đổi logic
- `test` → Viết hoặc cập nhật test case
- `chore` → Cấu hình, update dependencies

**Ví dụ:**
```sh
git commit -m "feat(auth): thêm chức năng đăng nhập bằng JWT"
git commit -m "fix(socket): sửa lỗi mất kết nối khi reload trang"
git commit -m "refactor(chat): tối ưu API lấy danh sách bạn bè"
```

---

## 🔄 3. Quy Trình Làm Việc

### 📌 1️⃣ Tạo nhánh mới
```sh
git checkout -b feature/chat-ui
```

### 📌 2️⃣ Thêm file vào staging
```sh
git add .
```

### 📌 3️⃣ Commit với tin nhắn chuẩn
```sh
git commit -m "feat(chat): thêm giao diện chat real-time"
```

### 📌 4️⃣ Cập nhật từ nhánh `main`
```sh
git checkout main
git pull origin main
git checkout feature/chat-ui
git merge main
```

### 📌 5️⃣ Đẩy lên remote
```sh
git push origin feature/chat-ui
```

### 📌 6️⃣ Tạo Pull Request (PR)
Lên GitHub/GitLab → Mở PR → Review code → Merge vào `main`.

---

## 🚀 4. Phát Hành Phiên Bản Mới (Versioning)
Mỗi lần cập nhật lớn, ta sử dụng **Git Tag** để đánh dấu phiên bản:
```sh
git tag -a v1.0.0 -m "Phát hành phiên bản đầu tiên"
git push origin v1.0.0
```
Sau này, nếu sửa lỗi:
```sh
git tag -a v1.0.1 -m "Sửa lỗi giao diện chat"
git push origin v1.0.1
```

---

## ✅ 5. Tổng Kết
- **Luôn tạo nhánh mới** khi làm tính năng/sửa lỗi.
- **Sử dụng commit message chuẩn** (feat, fix, refactor…).
- **Thường xuyên pull & merge** để tránh conflict.
- **Tạo Pull Request** trước khi merge vào `main`.
- **Dùng Git Tag** để đánh dấu phiên bản quan trọng.

Cảm ơn bạn đã đóng góp cho dự án! 🚀
